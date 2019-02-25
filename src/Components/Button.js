import React from 'react';
import styled from 'styled-components';

const Container = styled.button``;

class Button extends React.Component {
  render() {
    const { className, onClick, text } = this.props;
    return <Container className={className} onClick={onClick}>{text}</Container>
  }
}

export default Button;
