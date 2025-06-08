import streamDeck, { action, KeyDownEvent, KeyUpEvent, SingletonAction, DidReceiveSettingsEvent, WillAppearEvent, WillDisappearEvent } from "@elgato/streamdeck";

// マップごとのレイド時間設定（分）
const MAP_DURATIONS: { [key: string]: number } = {
  "factory": 20,
  "customs": 45,
  "woods": 45,
  "shoreline": 45,
  "interchange": 45,
  "reserve": 45,
  "lighthouse": 45,
  "labs": 35,
  "streets": 45,
  "ground-zero": 35
};

// グローバルレイド状態
interface RaidState {
  map: string | null;
  startTime: number | null;
  duration: number;
  isActive: boolean;
}

let currentRaid: RaidState = {
  map: null,
  startTime: null,
  duration: 0,
  isActive: false
};

// タイマー表示アクション
@action({ UUID: "com.gtech9971.eft-stream-deck-timer-plugin.raid-timer" })
export class RaidTimerAction extends SingletonAction {
  
  private updateInterval: NodeJS.Timeout | null = null;
  private isPaused: boolean = false;
  private pausedTime: number = 0;
  private keyDownTime: number = 0;
  private longPressThreshold: number = 1000; // 1000ms長押し判定
  private longPressTimer: NodeJS.Timeout | null = null;
  private isLongPress: boolean = false;

  override async onWillAppear(ev: WillAppearEvent) {
    await this.updateDisplay(ev.action);
    this.startTimer(ev.action);
  }

  override async onWillDisappear(ev: WillDisappearEvent) {
    this.stopTimer();
  }

  override async onKeyDown(ev: KeyDownEvent) {
    if (!currentRaid.isActive) return;
    
    this.keyDownTime = Date.now();
    this.isLongPress = false;
    
    // 長押し判定用タイマー開始
    this.longPressTimer = setTimeout(async () => {
      this.isLongPress = true;
      // 長押し時の視覚フィードバック
      await ev.action.setTitle("Clearing...");
    }, this.longPressThreshold);
  }

  override async onKeyUp(ev: KeyUpEvent) {
    if (!currentRaid.isActive) return;
    
    // タイマーをクリア
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const pressDuration = Date.now() - this.keyDownTime;
    
    if (this.isLongPress || pressDuration >= this.longPressThreshold) {
      // 長押し: タイマークリア
      this.endRaid();
      await ev.action.setTitle("No Raid");
      await ev.action.setImage(this.createTimerSVG("--:--", "#666666"));
    } else {
      // 短押し: 一時停止/再開
      await this.togglePause(ev.action);
    }
    
    this.isLongPress = false;
  }

  async togglePause(action: any) {
    if (!currentRaid.isActive || !currentRaid.startTime) return;
    
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      // 一時停止: 現在の経過時間を保存
      this.pausedTime = Date.now() - currentRaid.startTime;
      await action.setTitle("PAUSED");
    } else {
      // 再開: 開始時刻を調整
      currentRaid.startTime = Date.now() - this.pausedTime;
      await this.updateDisplay(action);
    }
  }

  startTimer(action: any) {
    this.stopTimer();
    this.updateInterval = setInterval(async () => {
      await this.updateDisplay(action);
    }, 1000);
  }

  stopTimer() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  async updateDisplay(action: any) {
    if (!currentRaid.isActive || !currentRaid.startTime) {
      await action.setTitle("No Raid");
      await action.setImage(this.createTimerSVG("--:--", "#666666"));
      return;
    }

    // 一時停止中は表示を更新しない
    if (this.isPaused) {
      return;
    }

    const now = Date.now();
    const elapsed = Math.floor((now - currentRaid.startTime) / 1000);
    const remaining = Math.max(0, currentRaid.duration * 60 - elapsed);

    if (remaining <= 0) {
      this.endRaid();
      await action.setTitle("EXTRACT!");
      await action.setImage(this.createTimerSVG("00:00", "#ff0000"));
      return;
    }

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // 残り時間に応じて色を変更
    let color = "#00ff00"; // 緑
    if (remaining < 300) color = "#ff0000"; // 赤（5分以下）
    else if (remaining < 600) color = "#ffff00"; // 黄（10分以下）

    await action.setTitle(timeString);
    await action.setImage(this.createTimerSVG(timeString, color, this.isPaused));
  }

  createTimerSVG(timeString: string, color: string, isPaused: boolean = false): string {
    const bgColor = isPaused ? "#2d2d00" : "#1a1a1a";
    const pauseIcon = isPaused ? `
      <rect x="58" y="58" width="8" height="28" fill="${color}" rx="2"/>
      <rect x="78" y="58" width="8" height="28" fill="${color}" rx="2"/>
    ` : '';
    
    const svg = `
      <svg width="144" height="144" xmlns="http://www.w3.org/2000/svg">
        <rect width="144" height="144" fill="${bgColor}" rx="10"/>
        <circle cx="72" cy="72" r="60" fill="none" stroke="${color}" stroke-width="4" 
                stroke-dasharray="${isPaused ? '5,5' : 'none'}"/>
        <text x="72" y="${isPaused ? '100' : '82'}" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
              fill="${color}" text-anchor="middle">${timeString}</text>
        ${pauseIcon}
        ${isPaused ? `<text x="72" y="120" font-family="Arial, sans-serif" font-size="10" 
              fill="#888888" text-anchor="middle">Click: resume | Hold: clear</text>` : 
              `<text x="72" y="120" font-family="Arial, sans-serif" font-size="10" 
              fill="#888888" text-anchor="middle">Click: pause | Hold: clear</text>`}
      </svg>
    `;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  endRaid() {
    currentRaid.isActive = false;
    currentRaid.map = null;
    currentRaid.startTime = null;
    currentRaid.duration = 0;
    this.isPaused = false;
    this.pausedTime = 0;
  }
}

// マップ選択アクション（長押し対応版）
@action({ UUID: "com.gtech9971.eft-stream-deck-timer-plugin.map-selector" })
export class MapSelectorAction extends SingletonAction {
  
  private currentMapIndex: number = 0;
  private maps: string[] = Object.keys(MAP_DURATIONS);
  private keyDownTime: number = 0;
  private longPressThreshold: number = 800; // 800ms長押し判定
  private longPressTimer: NodeJS.Timeout | null = null;
  private isLongPress: boolean = false;

  override async onWillAppear(ev: WillAppearEvent) {
    const settings = ev.payload.settings;
    if (settings.selectedMap) {
      this.currentMapIndex = this.maps.indexOf(settings.selectedMap as string);
    }
    await this.updateDisplay(ev.action);
  }

  override async onKeyDown(ev: KeyDownEvent) {
    this.keyDownTime = Date.now();
    this.isLongPress = false;
    
    // 長押し判定用タイマー開始
    this.longPressTimer = setTimeout(async () => {
      this.isLongPress = true;
      // 長押し時の視覚フィードバック
      await ev.action.setTitle("Starting Raid...");
      await this.startRaid(ev.action);
    }, this.longPressThreshold);
  }

  override async onKeyUp(ev: KeyUpEvent) {
    // タイマーをクリア
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const pressDuration = Date.now() - this.keyDownTime;
    
    // 短押しの場合のみマップ切り替え
    if (!this.isLongPress && pressDuration < this.longPressThreshold) {
      this.currentMapIndex = (this.currentMapIndex + 1) % this.maps.length;
      await ev.action.setSettings({ selectedMap: this.maps[this.currentMapIndex] });
      await this.updateDisplay(ev.action);
    }
    
    this.isLongPress = false;
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent) {
    const settings = ev.payload.settings;
    if (settings.selectedMap) {
      this.currentMapIndex = this.maps.indexOf(settings.selectedMap as string);
      await this.updateDisplay(ev.action);
    }
    if (settings.startRaid) {
      await this.startRaid(ev.action);
      // startRaidフラグをリセット
      await ev.action.setSettings({ ...settings, startRaid: false });
    }
  }

  async updateDisplay(action: any) {
    const currentMap = this.maps[this.currentMapIndex];
    const duration = MAP_DURATIONS[currentMap];
    
    const displayName = currentMap.charAt(0).toUpperCase() + currentMap.slice(1).replace('-', ' ');
    await action.setTitle(`${displayName}\n${duration}min`);
    await action.setImage(this.createMapSVG(displayName, duration));
  }

  async startRaid(action: any) {
    const selectedMap = this.maps[this.currentMapIndex];
    const duration = MAP_DURATIONS[selectedMap];
    
    currentRaid = {
      map: selectedMap,
      startTime: Date.now(),
      duration: duration,
      isActive: true
    };

    const displayName = selectedMap.charAt(0).toUpperCase() + selectedMap.slice(1).replace('-', ' ');
    await action.setTitle(`Raid Started!\n${displayName}`);
    await action.setImage(this.createMapSVG(displayName, duration, true));
    
    // 3秒後に通常表示に戻す
    setTimeout(async () => {
      await this.updateDisplay(action);
    }, 3000);
  }

  createMapSVG(mapName: string, duration: number, isStarted: boolean = false): string {
    const bgColor = isStarted ? "#1a3d1a" : "#2a2a2a";
    const borderColor = isStarted ? "#00ff00" : "#4a90e2";
    const textColor = isStarted ? "#00ff00" : "#ffffff";
    
    const svg = `
      <svg width="144" height="144" xmlns="http://www.w3.org/2000/svg">
        <rect width="144" height="144" fill="${bgColor}" rx="10"/>
        <rect x="10" y="10" width="124" height="124" fill="none" stroke="${borderColor}" stroke-width="2" rx="8"/>
        <text x="72" y="55" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
              fill="${textColor}" text-anchor="middle">${mapName}</text>
        <text x="72" y="85" font-family="Arial, sans-serif" font-size="14" 
              fill="${borderColor}" text-anchor="middle">${duration} minutes</text>
        ${!isStarted ? `
        <text x="72" y="105" font-family="Arial, sans-serif" font-size="9" 
              fill="#888888" text-anchor="middle">Click: cycle maps</text>
        <text x="72" y="120" font-family="Arial, sans-serif" font-size="9" 
              fill="#888888" text-anchor="middle">Hold: start raid</text>
        ` : ''}
      </svg>
    `;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }
}