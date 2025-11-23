const STORAGE_KEY = 'chameleon_groups';

const initializeStorage = () => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
};

export const getGroups = () => {
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(data);
};

export const createGroup = (name, ownerId) => {
    const groups = getGroups();
    const newGroup = {
        id: Date.now().toString(),
        name,
        ownerId,
        members: [ownerId], // Owner is automatically a member
        createdAt: new Date().toISOString()
    };
    groups.push(newGroup);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    return newGroup;
};

export const addMember = (groupId, userId) => {
    const groups = getGroups();
    const groupIndex = groups.findIndex(g => g.id === groupId);
    if (groupIndex !== -1) {
        if (!groups[groupIndex].members.includes(userId)) {
            groups[groupIndex].members.push(userId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
        }
        return groups[groupIndex];
    }
    return null;
};

export const removeMember = (groupId, userId) => {
    const groups = getGroups();
    const groupIndex = groups.findIndex(g => g.id === groupId);
    if (groupIndex !== -1) {
        groups[groupIndex].members = groups[groupIndex].members.filter(id => id !== userId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
        return groups[groupIndex];
    }
    return null;
};

export const getGroupsForUser = (userId) => {
    const groups = getGroups();
    return groups.filter(g => g.members.includes(userId));
};

export const deleteGroup = (groupId) => {
    const groups = getGroups();
    const filtered = groups.filter(g => g.id !== groupId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
