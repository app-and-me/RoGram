import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import theme from '@/styles/theme';
import typo from '@/styles/typo';
import Icon from '@/components/Icon';

interface MenuItem {
  id: string;
  title: string;
  items: { id: string; title: string; type?: 'lesson' | 'task'; priority?: number }[];
}

interface LearnSidebarProps {
  menuItems: MenuItem[];
  activeItem: { activeItemId: string; activeItemType: string };
  onItemSelect: (itemId: string, itemType?: string) => void;
}

const SidebarContainer = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: ${theme.Component.Spacing[500]}px;
  padding: ${theme.Component.Spacing[500]}px;
  border-right: 1px solid ${theme.Color.Line.Divider};
  background-color: ${theme.Color.Background.Standard.Primary};
  height: 80vh;
  overflow-y: auto;
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${theme.Component.Spacing[100]}px;
`;

const MenuHeader = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.Component.Spacing[150]}px;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border-radius: ${theme.Component.Radius[300]}px;
  padding: ${theme.Component.Spacing[300]}px ${theme.Component.Spacing[150]}px;

  &:hover {
    background-color: ${theme.Color.Components.Interactive.Hover};
  }
`;

const MenuHeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.Component.Spacing[150]}px;
`;

const MenuTitle = styled.span`
  ${typo.Body.Regular};
  font-weight: 500;
  color: ${theme.Color.Content.Standard.Tertiary};
`;

const MenuItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.Component.Spacing[200]}px;
  padding: ${theme.Component.Spacing[200]}px 0;
  margin-left: ${theme.Component.Spacing[300]}px;
`;

const MenuItem = styled.div<{ $active: boolean }>`
  display: flex;
  gap: ${theme.Component.Spacing[300]}px;
  padding: ${theme.Component.Spacing[300]}px ${theme.Component.Spacing[400]}px;
  border-radius: ${theme.Component.Radius[300]}px;
  cursor: pointer;
  background-color: ${({ $active }) =>
    $active ? theme.Color.Components.Interactive.Hover : 'transparent'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.Color.Components.Interactive.Hover};
  }
`;

const MenuItemText = styled.span<{ $active: boolean }>`
  ${typo.Body.Regular};
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  color: ${({ $active }) =>
    $active ? theme.Color.Content.Standard.Primary : theme.Color.Content.Standard.Tertiary};
`;

const LearnSidebar: React.FC<LearnSidebarProps> = ({ menuItems, activeItem, onItemSelect }) => {
  const { activeItemId, activeItemType } = activeItem;

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    menuItems.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
  );

  useEffect(() => {
    if (!activeItemId && menuItems.length > 0) {
      const allItems = menuItems.flatMap((section) =>
        section.items.map((item) => ({
          ...item,
          sectionId: section.id,
        }))
      );

      const sortedItems = [...allItems].sort((a, b) => {
        const priorityA = a.priority !== undefined ? a.priority : Infinity;
        const priorityB = b.priority !== undefined ? b.priority : Infinity;
        return priorityA - priorityB;
      });

      if (sortedItems.length > 0) {
        const highestPriorityItem = sortedItems[0];
        onItemSelect(highestPriorityItem.id, highestPriorityItem.type);
      }
    }
  }, [menuItems, activeItemId, onItemSelect]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <SidebarContainer>
      {menuItems.map((section) => (
        <MenuSection key={section.id}>
          <MenuHeader onClick={() => toggleSection(section.id)}>
            <MenuHeaderContent>
              <Icon
                name={section.id === 'lessons' ? 'book_2' : 'assignment'}
                size={20}
                color={theme.Color.Content.Standard.Tertiary}
              />
              <MenuTitle>{section.title}</MenuTitle>
            </MenuHeaderContent>
            <Icon
              name={expandedSections[section.id] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              size={20}
              color={theme.Color.Content.Standard.Tertiary}
            />
          </MenuHeader>

          {expandedSections[section.id] && (
            <MenuItems>
              {[...section.items]
                .sort((a, b) => {
                  const priorityA = a.priority !== undefined ? a.priority : Infinity;
                  const priorityB = b.priority !== undefined ? b.priority : Infinity;
                  return priorityA - priorityB;
                })
                .map((item) => {
                  const isActive = item.id === activeItemId && item.type === activeItemType;
                  return (
                    <MenuItem
                      key={item.id}
                      $active={isActive}
                      onClick={() => onItemSelect(item.id, item.type)}
                    >
                      <MenuItemText $active={isActive}>{item.title}</MenuItemText>
                    </MenuItem>
                  );
                })}
            </MenuItems>
          )}
        </MenuSection>
      ))}
    </SidebarContainer>
  );
};

export default LearnSidebar;
