"use client";

import Link from "next/link";
import styled from "styled-components";

const Container = styled.div`
  background-color: #eef3ff;
  min-height: 100vh;
  padding-bottom: 80px;
`;

const Header = styled.div`
  padding: 20px;
  text-align: center;
  background-color: white;
  font-weight: bold;
  font-size: 20px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
`;

const Content = styled.div`
  padding: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px 20px 0 0;
  z-index: 1000;
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #3646BA;
  font-size: 14px;
`;

const PlaceholderCard = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`;

export default function Home() {
  return (
    <Container>
      <Header>Hey, Léa ! Commence à courir !</Header>

      <Content>
        <PlaceholderCard>
          <strong>Objectif :</strong> Ne laisse pas tes baskets prendre la poussière !
        </PlaceholderCard>

        <PlaceholderCard>
          <strong>Challenges :</strong> Rejoins des courses amusantes et solidaires !
        </PlaceholderCard>

        <PlaceholderCard>
          <strong>Mon Feed :</strong> Découvre les courses récentes de tes amis !
        </PlaceholderCard>
      </Content>

      <BottomNav>
        <NavItem href="/">
          🏠
          <span>Accueil</span>
        </NavItem>
        <NavItem href="/map">
        🗺️
          <span>Cartes</span>
        </NavItem>
        <NavItem href="/groups">
          👥
          <span>Groupes</span>
        </NavItem>
        <NavItem href="/profile">
          👤
          <span>Profile</span>
        </NavItem>
      </BottomNav>
    </Container>
  );
}
