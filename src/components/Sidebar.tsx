import React from 'react';
import type { Ingredient } from '../types';
import { DraggableCard } from './DraggableCard';

interface SidebarProps {
    ingredients: Ingredient[];
    onDragStart: (e: React.MouseEvent, ingredientId: number) => void;
    discoveredIds: number[];
    masteryCounts: Record<number, number>;
    unlockedBaseIds: number[];
}

type TabType = 'ingredients' | 'techniques' | 'appliances' | 'library';

export const Sidebar: React.FC<SidebarProps> = ({ ingredients, onDragStart, discoveredIds, masteryCounts, unlockedBaseIds }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [activeTab, setActiveTab] = React.useState<TabType>('ingredients');

    const getMastery = (id: number) => masteryCounts[id] || 0;
    const isMastered = (id: number) => getMastery(id) >= 5;
    const isBaseUnlocked = (id: number) => unlockedBaseIds.includes(id);

    const baseIngredients = ingredients.filter(ing => ing.type === 'ingredient' && (ing.isBase ? isBaseUnlocked(ing.id) : isMastered(ing.id)));
    const baseTechniques = ingredients.filter(ing => ing.type === 'technique' && (ing.isBase ? isBaseUnlocked(ing.id) : isMastered(ing.id)));
    const baseAppliances = ingredients.filter(ing => ing.type === 'appliance' && (ing.isBase ? isBaseUnlocked(ing.id) : isMastered(ing.id)));
    const libraryItems = ingredients.filter(ing => !ing.isBase && discoveredIds.includes(ing.id));

    const getFilteredItems = () => {
        let items: Ingredient[] = [];
        switch (activeTab) {
            case 'ingredients': items = baseIngredients; break;
            case 'techniques': items = baseTechniques; break;
            case 'appliances': items = baseAppliances; break;
            case 'library': items = libraryItems; break;
        }
        return items.filter(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const displayItems = getFilteredItems();

    const tabs: { id: TabType; label: string; count?: number }[] = [
        { id: 'ingredients', label: 'Ingredients' },
        { id: 'techniques', label: 'Techniques' },
        { id: 'appliances', label: 'Appliances' },
        { id: 'library', label: 'Library', count: libraryItems.length },
    ];

    return (
        <div
            style={{
                width: '320px',
                height: '100vh',
                backgroundColor: '#121214',
                borderRight: '1px solid #27272a',
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                zIndex: 10,
                boxSizing: 'border-box',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h1 style={{ color: '#fff', fontSize: '18px', margin: 0, fontWeight: 700 }}>Kitchen Inventory</h1>
                
                <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        backgroundColor: '#1e1e24',
                        border: '1px solid #3f3f46',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                    }}
                />

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '8px' 
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '8px 4px',
                                backgroundColor: activeTab === tab.id ? '#3b82f6' : '#1e1e24',
                                border: '1px solid #3f3f46',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tab.label} {tab.count !== undefined && `(${tab.count})`}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {displayItems.length > 0 ? (
                        displayItems.map((ing) => (
                            <div key={ing.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <DraggableCard
                                        ingredient={ing}
                                        onMouseDown={(e) => {
                                            if (activeTab !== 'library' || isMastered(ing.id)) {
                                                onDragStart(e, ing.id);
                                            }
                                        }}
                                        style={activeTab === 'library' && !isMastered(ing.id) ? { 
                                            cursor: 'help',
                                            opacity: 0.8,
                                            borderStyle: 'dashed'
                                        } : {}}
                                    />
                                    {activeTab === 'library' && (
                                        <div style={{ fontSize: '12px', color: getMastery(ing.id) >= 5 ? '#10b981' : '#71717a' }}>
                                            {getMastery(ing.id)}/5
                                        </div>
                                    )}
                                </div>
                                {activeTab === 'library' && ing.directions && (
                                    <div style={{ 
                                        fontSize: '11px', 
                                        color: '#94a3b8', 
                                        padding: '6px 8px', 
                                        backgroundColor: '#1e1e24', 
                                        borderRadius: '4px',
                                        border: '1px solid #334155'
                                    }}>
                                        📝 {ing.directions}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ 
                            color: '#71717a', 
                            fontSize: '13px', 
                            textAlign: 'center', 
                            width: '100%',
                            marginTop: '40px',
                            fontStyle: 'italic'
                        }}>
                            {activeTab === 'library' && libraryItems.length === 0 
                                ? "Discover items to fill your library!" 
                                : "No items found."}
                        </div>
                    )}
                </div>
            </div>

            {activeTab === 'library' && displayItems.length > 0 && (
                <div style={{ 
                    marginTop: 'auto', 
                    padding: '12px', 
                    backgroundColor: '#1e1e24', 
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#94a3b8',
                    border: '14px solid #334155'
                }}>
                    💡 Reach 5 mastery to unlock an item for direct use in the kitchen.
                </div>
            )}
        </div>
    );
};
