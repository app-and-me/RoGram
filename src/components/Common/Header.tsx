import { styled } from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import theme from '@/styles/theme';
import typo from '@/styles/typo';
import Icon from '@/components/Icon';
import useUserStore from '@/store/useUserStore';

const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: ${theme.Component.Spacing[700]}px;
  gap: ${theme.Component.Spacing[700]}px;
  border-bottom: 1px solid ${theme.Color.Line.Divider};
  background-color: ${theme.Color.Background.Standard.Primary};
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${theme.Color.Content.Standard.Primary};
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.Component.Spacing[400]}px;
  margin-left: ${theme.Component.Spacing[600]}px;
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.Component.Spacing[200]}px;
  padding: ${theme.Component.Spacing[500]}px;
  cursor: pointer;
  position: relative;
  text-decoration: none;
`;

const NavText = styled.span<{ $active?: boolean }>`
  ${({ $active }) => ($active ? typo.Body.Strong : typo.Body.Regular)};
  color: ${({ $active }) =>
    $active ? theme.Color.Content.Standard.Primary : theme.Color.Content.Standard.Quaternary};
`;

const ActiveIndicator = styled.div<{ $active?: boolean }>`
  display: ${({ $active }) => ($active ? 'block' : 'none')};
  position: absolute;
  bottom: 0;
  height: 2px;
  width: 100%;
  background-color: ${theme.Color.Core.Accent};
  border-radius: ${theme.Component.Radius[200]}px;
`;

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const currentPath = location.pathname;

  const handleLearnClick = (e: React.MouseEvent) => {
    if (user.learning) {
      e.preventDefault();
      navigate(`/learn?robotId=${user.learning}`);
    }
  };

  return (
    <HeaderContainer>
      <LogoContainer to='/'>
        <Icon name='logo' width={75} height={32} color={theme.Color.Content.Standard.Primary} />
      </LogoContainer>
      <Navigation>
        <NavItem to='/' $active={currentPath === '/'}>
          <Icon
            name={currentPath === '/' ? 'home_fill' : 'home'}
            color={
              currentPath === '/'
                ? theme.Color.Content.Standard.Primary
                : theme.Color.Content.Standard.Quaternary
            }
          />
          <NavText $active={currentPath === '/'}>홈</NavText>
          <ActiveIndicator $active={currentPath === '/'} />
        </NavItem>
        <NavItem to='/learn' $active={currentPath.startsWith('/learn')} onClick={handleLearnClick}>
          <Icon
            name={currentPath.startsWith('/learn') ? 'local_library_fill' : 'local_library'}
            color={
              currentPath.startsWith('/learn')
                ? theme.Color.Content.Standard.Primary
                : theme.Color.Content.Standard.Quaternary
            }
          />
          <NavText $active={currentPath.startsWith('/learn')}>학습하기</NavText>
          <ActiveIndicator $active={currentPath.startsWith('/learn')} />
        </NavItem>
      </Navigation>
    </HeaderContainer>
  );
}

export default Header;
