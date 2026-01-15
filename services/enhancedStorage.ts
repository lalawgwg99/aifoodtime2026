// 增強版 LocalStorage 服務 - 用戶資料綁定
// 比 D1 簡單，同裝置跨瀏覽器同步

interface UserData {
    userId: string;
    favorites: any[];
    preferences: any;
    lastSync: number;
}

const STORAGE_KEY = 'savorchef_user_data';

export const enhancedStorage = {
    // 取得用戶資料
    getUserData(userId: string): UserData | null {
        try {
            const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return allData[userId] || null;
        } catch {
            return null;
        }
    },

    // 儲存用戶資料
    saveUserData(userId: string, data: Partial<UserData>): void {
        try {
            const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            allData[userId] = {
                ...allData[userId],
                ...data,
                userId,
                lastSync: Date.now(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
        } catch (error) {
            console.error('Failed to save user data:', error);
        }
    },

    // 收藏管理
    getFavorites(userId: string): any[] {
        const userData = this.getUserData(userId);
        return userData?.favorites || [];
    },

    addFavorite(userId: string, recipe: any): void {
        const favorites = this.getFavorites(userId);
        if (!favorites.find(f => f.id === recipe.id)) {
            favorites.push(recipe);
            this.saveUserData(userId, { favorites });
        }
    },

    removeFavorite(userId: string, recipeId: string): void {
        const favorites = this.getFavorites(userId);
        this.saveUserData(userId, {
            favorites: favorites.filter(f => f.id !== recipeId),
        });
    },

    isFavorite(userId: string, recipeId: string): boolean {
        const favorites = this.getFavorites(userId);
        return favorites.some(f => f.id === recipeId);
    },

    // 偏好記憶
    getPreferences(userId: string): any {
        const userData = this.getUserData(userId);
        return userData?.preferences || {};
    },

    updatePreferences(userId: string, preferences: any): void {
        const current = this.getPreferences(userId);
        this.saveUserData(userId, {
            preferences: { ...current, ...preferences },
        });
    },

    // 清除用戶資料
    clearUserData(userId: string): void {
        try {
            const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            delete allData[userId];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
        } catch (error) {
            console.error('Failed to clear user data:', error);
        }
    },

    // 取得所有用戶（用於遷移）
    getAllUsers(): string[] {
        try {
            const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return Object.keys(allData);
        } catch {
            return [];
        }
    },
};
