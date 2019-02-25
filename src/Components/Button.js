import React from 'react';
import styled from 'styled-components';

const Container = styled.button`
  
`;

class Button extends React.Component {
  render() {
    const { onClick, text } = this.props;
    return <Container onClick={onClick}>{text}</Container>
  }
}

export default Button;
