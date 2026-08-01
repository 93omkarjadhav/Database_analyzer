import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBox from '../components/ChatInput';

describe('Chat / SQL Autofix Component Tests', () => {
  const defaultProps = {
    input: '',
    setInput: jest.fn(),
    handleSend: jest.fn(),
    loading: false,
    activeChat: { source: 'MySQL Database' },
    selectedImages: [],
    setSelectedImages: jest.fn(),
  };

  test('renders query input box and send button', () => {
    render(<ChatBox {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText(/analyze your data source/i);
    const sendButton = screen.getByRole('button', { name: /send|run|execute/i });

    expect(inputElement).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  test('updates text input on user typing', () => {
    const setInput = jest.fn();
    render(<ChatBox {...defaultProps} setInput={setInput} />);

    const inputElement = screen.getByPlaceholderText(/analyze your data source/i);
    fireEvent.change(inputElement, { target: { value: 'SELECT * FROM users;' } });

    expect(setInput).toHaveBeenCalledWith('SELECT * FROM users;');
  });
});