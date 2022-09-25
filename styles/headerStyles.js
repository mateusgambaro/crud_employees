import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-around;
  background-color: #f5f4f0;
  padding: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
`;
