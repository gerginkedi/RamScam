const ACTIVITY_KEY = 'ramscam_activity';
const MAX_ACTIVITY = 50; // max 50 kayıt tutar

export function addActivity(game, result, amount) {
    try {
        const stored = localStorage.getItem(ACTIVITY_KEY);
        const activities = stored ? JSON.parse(stored) : [];
        
        activities.unshift({
            game,
            result,
            amount,
            timestamp: Date.now()
        });

        // Max 50 kayıt
        if (activities.length > MAX_ACTIVITY) {
            activities.splice(MAX_ACTIVITY);
        }

        localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
    } catch (_e) {
        // sessizce geç
    }
}

export function getActivities() {
    try {
        const stored = localStorage.getItem(ACTIVITY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (_e) {
        return [];
    }
}