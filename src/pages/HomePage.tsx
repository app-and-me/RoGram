import { styled } from 'styled-components';
import theme from '@/styles/theme';
import typo from '@/styles/typo';
import Icon from '@/components/Icon';
import { useState, useEffect } from 'react';
import useRobotStore from '@/store/useRobotStore';
import useUserStore from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: auto;
  padding-bottom: ${theme.Component.Spacing[700]}px;
  background-color: ${theme.Color.Background.Standard.Primary};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: ${theme.Component.Spacing[700]}px;
  padding: ${theme.Component.Spacing[1000]}px ${theme.Component.Spacing[700]}px;
`;

const SearchContainer = styled.div`
  width: 360px;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.Component.Spacing[200]}px;
  padding: ${theme.Component.Spacing[300]}px ${theme.Component.Spacing[400]}px;
  background-color: ${theme.Color.Components.Translucent.Secondary};
  border: 1px solid ${theme.Color.Components.Translucent.Tertiary};
  border-radius: ${theme.Component.Radius[300]}px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  ${typo.Body.Regular};
  color: ${theme.Color.Content.Standard.Primary};
  &::placeholder {
    color: rgba(41, 42, 46, 0.5);
  }
`;

const RobotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.Component.Spacing[700]}px;
  width: 100%;
`;

const RobotCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.Component.Spacing[200]}px;
  padding: ${theme.Component.Spacing[600]}px ${theme.Component.Spacing[700]}px;
  background-color: ${theme.Color.Components.Fill.Standard.Tertiary};
  border-radius: ${theme.Component.Radius[800]}px;
  cursor: pointer;
`;

const RobotImage = styled.div`
  width: 180px;
  height: 180px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const RobotName = styled.h3`
  ${typo.Title.Strong};
  color: ${theme.Color.Content.Standard.Primary};
  margin: 0;
`;

function HomePage() {
  const { robots, fetchRobots, setActiveRobot, getRobotLessons } = useRobotStore();
  const { setLearningRobot } = useUserStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRobots, setFilteredRobots] = useState(robots);

  useEffect(() => {
    fetchRobots();
  }, [fetchRobots]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRobots(robots);
      return;
    }

    const filtered = robots.filter((robot) =>
      robot.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRobots(filtered);
  }, [searchTerm, robots]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRobotClick = (robotId: string) => {
    setActiveRobot(robotId);
    setLearningRobot(robotId);

    if (getRobotLessons(robotId)) {
      navigate(`/learn?robotId=${robotId}`);
    }
  };

  return (
    <Container>
      <Content>
        <SearchContainer>
          <SearchInputWrapper>
            <Icon name='search' size={24} color={theme.Color.Content.Standard.Primary} />
            <SearchInput
              placeholder='로봇 검색하기'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <Icon
                name='close'
                size={20}
                color={theme.Color.Content.Standard.Primary}
                onClick={() => setSearchTerm('')}
              />
            )}
          </SearchInputWrapper>
        </SearchContainer>

        <RobotGrid>
          {filteredRobots.length > 0 ? (
            filteredRobots.map((robot) => (
              <RobotCard key={robot.id} onClick={() => handleRobotClick(robot.id)}>
                <RobotName>{robot.name}</RobotName>
                <RobotImage style={{ backgroundImage: `url(${robot.image})` }} />
              </RobotCard>
            ))
          ) : (
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                gridColumn: '1 / -1',
                padding: `${theme.Component.Spacing[700]}px`,
              }}
            >
              <p
                style={{
                  fontSize: typo.Body.Regular['font-size' as keyof typeof typo.Body.Regular],
                  fontWeight: typo.Body.Regular['font-weight' as keyof typeof typo.Body.Regular],
                  fontFamily: typo.Body.Regular['font-family' as keyof typeof typo.Body.Regular],
                  lineHeight: typo.Body.Regular['line-height' as keyof typeof typo.Body.Regular],
                  color: theme.Color.Content.Standard.Tertiary,
                }}
              >
                검색 결과가 없습니다.
              </p>
            </div>
          )}
        </RobotGrid>
      </Content>
    </Container>
  );
}

export default HomePage;
