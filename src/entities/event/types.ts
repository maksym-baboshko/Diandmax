// Game hub event types — populated in game hub phase
export interface GameEvent {
  id: string;
  type: string;
  playerId: string;
  payload: Record<string, unknown>;
  xpDelta: number;
  createdAt: Date;
}
