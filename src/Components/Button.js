import React from 'react';
import styled from 'styled-components';

const Container = styled.button`
  margin: 8px auto;
  display: block;
`;

class Button extends React.PureComponent {
  render() {
    const { className, onClick, text } = this.props;
    return <Container className={className} onClick={onClick}>{text}</Container>
  }
}

export default Button;
