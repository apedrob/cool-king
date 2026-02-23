import { Server, Socket } from "socket.io";
import {
    GameState,
    GamePhase,
    CardType,
    initializeGame,
    placeBid,
    updateGameState,
    chooseEscapeOrPirate,
    continueTrick,
    continueRound,
    isValidPlay,
    chooseBid,
    chooseCard,
    chooseTigress,
    getBotName,
} from "@cool-king/engine";
import {
    createRoom,
    joinRoom,
    leaveRoom,
    getRoom,
    updateRoom,
    sanitizeState,
    touchRoom,
    markDisconnected,
    reconnectPlayer,
    replaceWithBot,
    getRoomByPlayerId,
    getPlayerIdBySocket,
    getSocketId,
    addBot,
    removeBot,
    getPublicRooms,
    leaveAllRoomsBySocket,
} from "./rooms.js";

// ─── Helper: Broadcast sanitized state to all players ──

function broadcastState(io: Server, roomId: string) {
    const state = getRoom(roomId);
    if (!state) return;

    touchRoom(roomId);
    for (const player of state.players) {
        if (player.isBot) continue; // bots don't need state
        const sid = getSocketId(player.id) || player.socketId;
        io.to(sid).emit("game-state", sanitizeState(state, player.id));
    }
}

/** Push fresh public room list to everyone browsing the match lobby. */
function broadcastPublicRooms(io: Server) {
    io.to("lobby-browser").emit("rooms-updated", getPublicRooms());
}

// ─── Helper: Schedule bot turn if current player is a bot ──

function scheduleBotTurn(io: Server, roomId: string) {
    const state = getRoom(roomId);
    if (!state) return;

    const currentPlayer = state.players.find((p) => p.id === state.currentPlayer);
    if (!currentPlayer?.isBot || !currentPlayer.botDifficulty) return;

    // Random delay for natural feel (600-1500ms)
    const delay = 600 + Math.floor(Math.random() * 900);

    setTimeout(() => {
        processBotTurn(io, roomId);
    }, delay);
}

function processBotTurn(io: Server, roomId: string) {
    const state = getRoom(roomId);
    if (!state) return;

    const bot = state.players.find((p) => p.id === state.currentPlayer);
    if (!bot?.isBot || !bot.botDifficulty) return;

    try {
        switch (state.phase) {
            case GamePhase.PLAYING: {
                const card = chooseCard(bot, state, bot.botDifficulty);
                const newState = updateGameState(state, bot.id, card);
                newState.roomId = state.roomId;
                updateRoom(state.roomId, newState);
                broadcastState(io, state.roomId);
                scheduleBotTurn(io, state.roomId);
                break;
            }

            case GamePhase.CHOOSING_TIGRESS: {
                const choice = chooseTigress(bot, state, bot.botDifficulty);
                const newState = chooseEscapeOrPirate(state, choice);
                newState.roomId = state.roomId;
                updateRoom(state.roomId, newState);
                broadcastState(io, state.roomId);
                scheduleBotTurn(io, state.roomId);
                break;
            }

            case GamePhase.TRICK_RESULT: {
                const newState = continueTrick(state);
                newState.roomId = state.roomId;
                updateRoom(state.roomId, newState);
                broadcastState(io, state.roomId);

                // If round just moved to scoring, start the scoring timer
                if (newState.phase === GamePhase.ROUND_SCORING) {
                    startScoringTimer(io, state.roomId);
                } else {
                    scheduleBotTurn(io, state.roomId);
                }
                break;
            }

            case GamePhase.ROUND_SCORING: {
                // Bots don't auto-continue rounds anymore to let UI show results
                break;
            }
        }
    } catch (err: unknown) {
        console.error(`[bot-error] ${bot.name}: ${(err as Error).message}`);
    }
}

// ─── Helper: Bidding Timer (30s) ────────────────────

const bidTimers = new Map<string, NodeJS.Timeout>();

function clearBidTimer(roomId: string) {
    const timer = bidTimers.get(roomId);
    if (timer) {
        clearTimeout(timer);
        bidTimers.delete(roomId);
    }
}

function startBidTimer(io: Server, roomId: string) {
    clearBidTimer(roomId);

    const timer = setTimeout(() => {
        bidTimers.delete(roomId);
        let state = getRoom(roomId);
        if (!state || state.phase !== GamePhase.BIDDING) return;

        // Auto-bid 0 for anyone who hasn't bid yet
        for (const player of state.players) {
            if (player.bid === undefined) {
                state = placeBid(state, player.id, 0);
                state.roomId = roomId;
                updateRoom(roomId, state);
            }
        }

        broadcastState(io, roomId);
        // Bidding is done — schedule first playing turn if it's a bot
        scheduleBotTurn(io, roomId);
    }, 30_000);

    bidTimers.set(roomId, timer);
}

// ─── Helper: Scoring Timer (10s) ───────────────────

const scoringTimers = new Map<string, NodeJS.Timeout>();

function clearScoringTimer(roomId: string) {
    const timer = scoringTimers.get(roomId);
    if (timer) {
        clearTimeout(timer);
        scoringTimers.delete(roomId);
    }
}

function startScoringTimer(io: Server, roomId: string) {
    clearScoringTimer(roomId);

    const timer = setTimeout(() => {
        scoringTimers.delete(roomId);
        const state = getRoom(roomId);
        if (!state || state.phase !== GamePhase.ROUND_SCORING) return;

        const newState = continueRound(state);
        newState.roomId = roomId;
        updateRoom(roomId, newState);
        broadcastState(io, roomId);

        if (newState.phase === GamePhase.BIDDING) {
            startBidTimer(io, roomId);
            scheduleBotBids(io, roomId);
        } else {
            scheduleBotTurn(io, roomId);
        }
    }, 10_000);

    scoringTimers.set(roomId, timer);
}

function scheduleBotBids(io: Server, roomId: string) {
    const state = getRoom(roomId);
    if (!state || state.phase !== GamePhase.BIDDING) return;

    // All bots bid simultaneously with staggered delays
    const bots = state.players.filter((p) => p.isBot && p.botDifficulty && p.bid === undefined);
    bots.forEach((bot, i) => {
        const delay = 800 + Math.floor(Math.random() * 1200) + i * 300;
        setTimeout(() => {
            const current = getRoom(roomId);
            if (!current || current.phase !== GamePhase.BIDDING) return;

            const currentBot = current.players.find((p) => p.id === bot.id);
            if (!currentBot?.isBot || !currentBot.botDifficulty || currentBot.bid !== undefined) return;

            try {
                const bid = chooseBid(currentBot, current.currentRound, currentBot.botDifficulty);
                const newState = placeBid(current, bot.id, bid);
                newState.roomId = roomId;
                updateRoom(roomId, newState);
                broadcastState(io, roomId);

                // If all bids are in, clear the timer and schedule first play
                if (newState.phase === GamePhase.PLAYING) {
                    clearBidTimer(roomId);
                    scheduleBotTurn(io, roomId);
                }
            } catch (err: unknown) {
                console.error(`[bot-bid-error] ${bot.name}: ${(err as Error).message}`);
            }
        }, delay);
    });
}

// ─── Helper: Find room + player, validate turn ────────

interface RoomContext {
    room: GameState;
    playerId: string;
}

function requireRoom(socketId: string): RoomContext {
    const playerId = getPlayerIdBySocket(socketId);
    if (!playerId) throw new Error("Not in a room");

    const room = getRoomByPlayerId(playerId);
    if (!room) throw new Error("Not in a room");

    return { room, playerId };
}

function requireTurn(ctx: RoomContext, phase: GamePhase): RoomContext {
    if (ctx.room.phase !== phase) throw new Error(`Not in ${phase} phase`);
    if (ctx.room.currentPlayer !== ctx.playerId) throw new Error("Not your turn");
    return ctx;
}

// ─── Disconnect Timers (bot takeover after 30s) ───────

const disconnectTimers = new Map<string, NodeJS.Timeout>(); // playerId → timer

function clearDisconnectTimer(playerId: string) {
    const timer = disconnectTimers.get(playerId);
    if (timer) {
        clearTimeout(timer);
        disconnectTimers.delete(playerId);
    }
}

function startDisconnectTimer(io: Server, roomId: string, playerId: string) {
    clearDisconnectTimer(playerId);

    const timer = setTimeout(() => {
        disconnectTimers.delete(playerId);
        triggerBotReplacement(io, roomId, playerId);
    }, 30_000);

    disconnectTimers.set(playerId, timer);
}

function triggerBotReplacement(io: Server, roomId: string, playerId: string) {
    const state = replaceWithBot(roomId, playerId);
    if (!state) return;

    console.log(`[bot-replace] Player ${playerId} replaced by bot in room ${roomId}`);
    broadcastState(io, roomId);

    // If it's now the bot's turn, kick off the bot AI
    const botPlayer = state.players.find((p) => p.id === playerId);
    if (botPlayer?.isBot) {
        if (state.phase === GamePhase.BIDDING && botPlayer.bid === undefined) {
            scheduleBotBids(io, roomId);
        } else if (state.currentPlayer === playerId) {
            scheduleBotTurn(io, roomId);
        }
    }
}

// ─── Event Handlers ────────────────────────────────

export function registerHandlers(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log(`[connect] ${socket.id}`);

        const emitError = (msg: string) => socket.emit("error", { message: msg });

        const handle = (fn: () => void) => {
            try { fn(); } catch (err: unknown) { emitError((err as Error).message); }
        };

        // ─── Create Room ───────────────────────────────
        socket.on("create-room", ({ playerName }: { playerName: string }) => handle(() => {
            if (!playerName?.trim()) throw new Error("Name is required");

            // Cleanly leave any existing rooms (triggers host migration if needed)
            const oldRooms = leaveAllRoomsBySocket(socket.id);
            for (const { roomId: oldId, state: newState } of oldRooms) {
                if (!newState) {
                    // Room was completely empty and destroyed
                    io.in(oldId).emit("room-dissolved");
                    io.in(oldId).socketsLeave(oldId);
                } else {
                    // Room survives, send the updated state (with new host)
                    broadcastState(io, oldId);
                    // Also make this specific socket leave the socket.io room
                    socket.leave(oldId);
                }
            }

            const state = createRoom(playerName, socket.id);
            socket.join(state.roomId);
            socket.emit("room-created", {
                roomId: state.roomId,
                playerId: state.players[0].id,
            });
            broadcastState(io, state.roomId);
            if (oldRooms.length > 0) broadcastPublicRooms(io);
            broadcastPublicRooms(io);
        }));

        // ─── Join Room ─────────────────────────────────
        socket.on("join-room", ({ roomId, playerName }: { roomId: string; playerName: string }) => handle(() => {
            if (!playerName?.trim()) throw new Error("Name is required");
            if (!roomId?.trim()) throw new Error("Room code is required");

            const state = joinRoom(roomId.toUpperCase(), playerName, socket.id);
            const newPlayer = state.players[state.players.length - 1];
            socket.join(state.roomId);
            // Leave lobby browser if they were browsing
            socket.leave("lobby-browser");
            socket.emit("room-joined", { playerId: newPlayer.id, roomId: state.roomId });
            broadcastState(io, state.roomId);
            broadcastPublicRooms(io);
        }));

        // ─── Add Bot ───────────────────────────────────
        socket.on("add-bot", ({ difficulty }: { difficulty: "easy" | "medium" | "hard" }) => handle(() => {
            const { room, playerId } = requireRoom(socket.id);
            const player = room.players.find((p) => p.id === playerId);
            if (!player?.isHost) throw new Error("Only the host can add bots");

            if (!["easy", "medium", "hard"].includes(difficulty))
                throw new Error("Invalid difficulty");

            const botName = getBotName(difficulty);
            addBot(room.roomId, difficulty, botName);
            broadcastState(io, room.roomId);
        }));

        // ─── Remove Bot ────────────────────────────────
        socket.on("remove-bot", ({ botId }: { botId: string }) => handle(() => {
            const { room, playerId } = requireRoom(socket.id);
            const player = room.players.find((p) => p.id === playerId);
            if (!player?.isHost) throw new Error("Only the host can remove bots");

            removeBot(room.roomId, botId);
            broadcastState(io, room.roomId);
        }));

        // ─── Reconnect ─────────────────────────────────
        socket.on("reconnect-room", ({ roomId, playerId }: { roomId: string; playerId: string }) => handle(() => {
            clearDisconnectTimer(playerId); // cancel pending bot replacement
            const state = reconnectPlayer(roomId, playerId, socket.id);
            if (!state) throw new Error("Room or player not found");
            socket.join(state.roomId);
            broadcastState(io, state.roomId);
        }));

        // ─── Leave Room (explicit quit) ────────────────
        socket.on("leave-room", () => handle(() => {
            const { room, playerId } = requireRoom(socket.id);

            if (room.phase === GamePhase.WAITING || room.phase === GamePhase.GAME_OVER) {
                // In lobby or game over: just remove the player
                const newState = leaveRoom(room.roomId, playerId);
                socket.leave(room.roomId);
                if (newState) broadcastState(io, room.roomId);
            } else {
                // Mid-game: immediately replace with bot
                socket.leave(room.roomId);
                triggerBotReplacement(io, room.roomId, playerId);
            }
            broadcastPublicRooms(io);
        }));

        // ─── Start Game ────────────────────────────────
        socket.on("start-game", () => handle(() => {
            const { room, playerId } = requireRoom(socket.id);
            const player = room.players.find((p) => p.id === playerId);

            if (!player?.isHost) throw new Error("Only the host can start");
            if (room.players.length < 3) throw new Error("Need at least 3 players");
            if (room.phase !== GamePhase.WAITING) throw new Error("Game already started");

            const newState = initializeGame(room.players, 10);
            newState.roomId = room.roomId;
            updateRoom(room.roomId, newState);
            broadcastState(io, room.roomId);
            broadcastPublicRooms(io); // room is no longer open

            // Start bid timer + schedule bot bids
            startBidTimer(io, room.roomId);
            scheduleBotBids(io, room.roomId);
        }));

        // ─── Browse Match Lobby (subscribe to open rooms list) ──
        socket.on("browse-lobby", () => {
            socket.join("lobby-browser");
            socket.emit("rooms-list", getPublicRooms());
        });

        // ─── Leave Match Lobby (unsubscribe) ────────────
        socket.on("leave-lobby", () => {
            socket.leave("lobby-browser");
        });

        // ─── List Rooms (one-shot fetch) ────────────────
        socket.on("list-rooms", () => {
            socket.emit("rooms-list", getPublicRooms());
        });

        // ─── Place Bid (simultaneous — any player can bid) ──
        socket.on("place-bid", ({ bid }: { bid: number }) => handle(() => {
            const { room, playerId } = requireRoom(socket.id);
            if (room.phase !== GamePhase.BIDDING) throw new Error("Not in BIDDING phase");

            const player = room.players.find((p) => p.id === playerId);
            if (!player) throw new Error("Player not found");
            if (player.bid !== undefined) throw new Error("Already bid");

            if (typeof bid !== "number" || bid < 0 || bid > room.currentRound)
                throw new Error("Invalid bid");

            const newState = placeBid(room, playerId, bid);
            newState.roomId = room.roomId;
            updateRoom(room.roomId, newState);
            broadcastState(io, room.roomId);

            // If all bids are in, clear timer and start playing
            if (newState.phase === GamePhase.PLAYING) {
                clearBidTimer(room.roomId);
                scheduleBotTurn(io, room.roomId);
            }
        }));

        // ─── Play Card ─────────────────────────────────
        socket.on("play-card", ({ cardId }: { cardId: string }) => handle(() => {
            const ctx = requireTurn(requireRoom(socket.id), GamePhase.PLAYING);

            const player = ctx.room.players.find((p) => p.id === ctx.playerId)!;
            const card = player.hand.find((c) => c.id === cardId);
            if (!card) throw new Error("Card not in hand");

            if (!isValidPlay(card, player.hand, ctx.room.leadColor))
                throw new Error("Must follow suit");

            const newState = updateGameState(ctx.room, ctx.playerId, card);
            newState.roomId = ctx.room.roomId;
            updateRoom(ctx.room.roomId, newState);
            broadcastState(io, ctx.room.roomId);
            scheduleBotTurn(io, ctx.room.roomId);
        }));

        // ─── Choose Tigress ────────────────────────────
        socket.on("choose-tigress", ({ choice }: { choice: "escape" | "pirate" }) => handle(() => {
            const ctx = requireTurn(requireRoom(socket.id), GamePhase.CHOOSING_TIGRESS);

            if (choice !== "escape" && choice !== "pirate")
                throw new Error("Invalid Tigress choice");

            const choiceType = choice === "pirate" ? CardType.PIRATE : CardType.ESCAPE;
            const newState = chooseEscapeOrPirate(ctx.room, choiceType);
            newState.roomId = ctx.room.roomId;
            updateRoom(ctx.room.roomId, newState);
            broadcastState(io, ctx.room.roomId);
            scheduleBotTurn(io, ctx.room.roomId);
        }));

        // ─── Continue Trick ─────────────────────────────
        socket.on("continue-trick", () => handle(() => {
            const { room } = requireRoom(socket.id);
            if (room.phase !== GamePhase.TRICK_RESULT) throw new Error("Not in TRICK_RESULT phase");

            const newState = continueTrick(room);
            newState.roomId = room.roomId;
            updateRoom(room.roomId, newState);
            broadcastState(io, room.roomId);

            if (newState.phase === GamePhase.ROUND_SCORING) {
                startScoringTimer(io, room.roomId);
            } else {
                scheduleBotTurn(io, room.roomId);
            }
        }));

        // ─── Continue Round ─────────────────────────────
        socket.on("continue-round", () => handle(() => {
            const { room } = requireRoom(socket.id);
            if (room.phase !== GamePhase.ROUND_SCORING) throw new Error("Not in ROUND_SCORING phase");

            clearScoringTimer(room.roomId);

            const newState = continueRound(room);
            newState.roomId = room.roomId;
            updateRoom(room.roomId, newState);
            broadcastState(io, room.roomId);

            // Next round = bidding phase with timer
            if (newState.phase === GamePhase.BIDDING) {
                startBidTimer(io, room.roomId);
                scheduleBotBids(io, room.roomId);
            } else {
                scheduleBotTurn(io, room.roomId);
            }
        }));

        // ─── Play Again ────────────────────────────────
        socket.on("play-again", () => handle(() => {
            const { room, playerId } = requireRoom(socket.id);
            const player = room.players.find((p) => p.id === playerId);

            if (!player?.isHost) throw new Error("Only the host can restart");
            if (room.phase !== GamePhase.GAME_OVER) throw new Error("Game not over");

            const resetState: GameState = {
                ...room,
                phase: GamePhase.WAITING,
                currentRound: 0,
                currentTrick: [],
                currentPlayer: "",
                leadColor: undefined,
                trickWinner: undefined,
                roundScores: undefined,
                roundBonuses: undefined,
                escapeOrPirateCard: undefined,
                players: room.players.map((p) => ({
                    ...p,
                    hand: [],
                    tricks: 0,
                    score: 0,
                    bid: undefined,
                })),
            };

            updateRoom(room.roomId, resetState);
            broadcastState(io, room.roomId);
        }));

        // ─── Disconnect ────────────────────────────────
        socket.on("disconnect", () => {
            console.log(`[disconnect] ${socket.id}`);
            const result = markDisconnected(socket.id);
            if (!result) return;

            broadcastState(io, result.state.roomId);

            // Start bot takeover timer for active games
            if (result.wasInGame) {
                startDisconnectTimer(io, result.state.roomId, result.playerId);
            }
        });
    });
}
