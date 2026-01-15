// 使用次數限制服務
interface UsageRecord {
    date: string;
    count: number;
}

const USAGE_KEY = 'smartchef_usage';
const MAX_FREE_USES = 3;

export const usageService = {
    // 取得今日使用次數
    getTodayUsage(): number {
        const record = this.getUsageRecord();
        const today = new Date().toDateString();

        if (record.date !== today) {
            // 新的一天，重置計數
            this.resetUsage();
            return 0;
        }

        return record.count;
    },

    // 增加使用次數
    incrementUsage(): void {
        const record = this.getUsageRecord();
        const today = new Date().toDateString();

        if (record.date !== today) {
            // 新的一天
            this.saveUsageRecord({ date: today, count: 1 });
        } else {
            this.saveUsageRecord({ date: today, count: record.count + 1 });
        }
    },

    // 檢查是否可以使用（未登入用戶）
    canUse(isLoggedIn: boolean): boolean {
        if (isLoggedIn) {
            return true; // 登入用戶無限制
        }

        return this.getTodayUsage() < MAX_FREE_USES;
    },

    // 取得剩餘次數
    getRemainingUses(isLoggedIn: boolean): number {
        if (isLoggedIn) {
            return Infinity;
        }

        const used = this.getTodayUsage();
        return Math.max(0, MAX_FREE_USES - used);
    },

    // 私有方法
    getUsageRecord(): UsageRecord {
        const stored = localStorage.getItem(USAGE_KEY);
        if (!stored) {
            return { date: '', count: 0 };
        }
        try {
            return JSON.parse(stored);
        } catch {
            return { date: '', count: 0 };
        }
    },

    saveUsageRecord(record: UsageRecord): void {
        localStorage.setItem(USAGE_KEY, JSON.stringify(record));
    },

    resetUsage(): void {
        const today = new Date().toDateString();
        this.saveUsageRecord({ date: today, count: 0 });
    }
};
