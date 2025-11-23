import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Users, Plus, Trash2, UserPlus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getGroupsForUser, createGroup, addMember, removeMember, deleteGroup } from '../services/groupService';

const GroupsView = () => {
    const navigate = useNavigate();
    const { currentUser, users } = useAuth();
    const [groups, setGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null); // For managing members

    useEffect(() => {
        if (currentUser) {
            loadGroups();
        }
    }, [currentUser]);

    const loadGroups = () => {
        setGroups(getGroupsForUser(currentUser.id));
    };

    const handleCreateGroup = (e) => {
        e.preventDefault();
        if (newGroupName.trim()) {
            createGroup(newGroupName, currentUser.id);
            setNewGroupName('');
            setShowCreateModal(false);
            loadGroups();
        }
    };

    const handleDeleteGroup = (groupId) => {
        if (window.confirm('Are you sure you want to delete this group?')) {
            deleteGroup(groupId);
            loadGroups();
            if (selectedGroup?.id === groupId) setSelectedGroup(null);
        }
    };

    const handleAddMember = (groupId, userId) => {
        addMember(groupId, userId);
        loadGroups();
        // Update selected group to reflect changes
        if (selectedGroup?.id === groupId) {
            const updatedGroups = getGroupsForUser(currentUser.id);
            setSelectedGroup(updatedGroups.find(g => g.id === groupId));
        }
    };

    const handleRemoveMember = (groupId, userId) => {
        removeMember(groupId, userId);
        loadGroups();
        if (selectedGroup?.id === groupId) {
            const updatedGroups = getGroupsForUser(currentUser.id);
            setSelectedGroup(updatedGroups.find(g => g.id === groupId));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-secondary font-bold text-primary flex items-center gap-2">
                    <Users size={28} />
                    My Groups
                </h1>
                <Button size="sm" onClick={() => setShowCreateModal(true)}>
                    <Plus size={20} />
                </Button>
            </div>

            {/* Groups List */}
            {groups.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted">You haven't joined any groups yet.</p>
                    <Button variant="link" onClick={() => setShowCreateModal(true)}>
                        Create a Group
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {groups.map(group => (
                        <Card key={group.id} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle>{group.name}</CardTitle>
                                {group.ownerId === currentUser.id && (
                                    <button
                                        onClick={() => handleDeleteGroup(group.id)}
                                        className="text-muted hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-muted mb-4">
                                    <span>{group.members.length} members</span>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedGroup(group)}>
                                        Manage
                                    </Button>
                                </div>
                                <div className="flex -space-x-2 overflow-hidden">
                                    {group.members.slice(0, 5).map(memberId => {
                                        const member = users.find(u => u.id === memberId);
                                        return (
                                            <div key={memberId} className="inline-block h-8 w-8 rounded-full ring-2 ring-surface bg-muted/20 flex items-center justify-center text-xs" title={member?.name}>
                                                {member?.avatar || '?'}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Create New Group</CardTitle>
                            <button onClick={() => setShowCreateModal(false)}>
                                <X size={20} />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateGroup} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Group Name (e.g. Family Dinners)"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-theme border border-muted/20 bg-background text-text"
                                    autoFocus
                                />
                                <Button type="submit" className="w-full">Create Group</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Manage Group Modal */}
            {selectedGroup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-surface z-10">
                            <CardTitle>Manage {selectedGroup.name}</CardTitle>
                            <button onClick={() => setSelectedGroup(null)}>
                                <X size={20} />
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Current Members */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Members</h3>
                                <div className="space-y-2">
                                    {selectedGroup.members.map(memberId => {
                                        const member = users.find(u => u.id === memberId);
                                        const isMe = memberId === currentUser.id;
                                        const isOwner = memberId === selectedGroup.ownerId;

                                        return (
                                            <div key={memberId} className="flex items-center justify-between p-2 rounded-theme bg-muted/5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{member?.avatar}</span>
                                                    <span className="font-medium">
                                                        {member?.name} {isMe && '(You)'}
                                                    </span>
                                                    {isOwner && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Owner</span>}
                                                </div>
                                                {selectedGroup.ownerId === currentUser.id && !isMe && (
                                                    <button
                                                        onClick={() => handleRemoveMember(selectedGroup.id, memberId)}
                                                        className="text-muted hover:text-red-500"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Add Members */}
                            {selectedGroup.ownerId === currentUser.id && (
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Add Members</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {users
                                            .filter(u => !selectedGroup.members.includes(u.id))
                                            .map(user => (
                                                <button
                                                    key={user.id}
                                                    onClick={() => handleAddMember(selectedGroup.id, user.id)}
                                                    className="flex items-center justify-between p-2 rounded-theme border border-muted/20 hover:bg-muted/5 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">{user.avatar}</span>
                                                        <span>{user.name}</span>
                                                    </div>
                                                    <UserPlus size={16} className="text-primary" />
                                                </button>
                                            ))}
                                        {users.filter(u => !selectedGroup.members.includes(u.id)).length === 0 && (
                                            <p className="text-sm text-muted italic">All users are already in this group.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default GroupsView;
