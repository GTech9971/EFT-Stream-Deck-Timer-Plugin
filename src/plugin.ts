import streamDeck from "@elgato/streamdeck";
import { RaidTimerAction, MapSelectorAction } from "./actions/eft-timer-actions";

// アクションを登録
streamDeck.actions.registerAction(new RaidTimerAction());
streamDeck.actions.registerAction(new MapSelectorAction());

// Stream Deckに接続
streamDeck.connect();