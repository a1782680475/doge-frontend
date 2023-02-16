export default {
    getRemindData(reminds: API.RemindItem[]): API.RemindItem[] {
        if (!reminds || reminds.length === 0 || !Array.isArray(reminds)) {
            return [];
        }
        const newReminds = reminds.map((remind) => {
            const newRemind = { ...remind };
            if (newRemind.id) {
                newRemind.key = newRemind.id;
            }
            if (newRemind.targetType) {
                const remindImg = {
                    account: {
                        img: "/system_remind_account.png"
                    },
                    service: {
                        img: "/system_remind_service.png"
                    }
                }[newRemind.targetType];
                newRemind.extra = remindImg?.img;
            }
            return newRemind;
        });
        return newReminds;
    }
}