import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SelectionList } from '@/components/SelectionList';

jest.mock('lucide-react-native', () => ({
  Circle: () => 'Circle-Icon',
  CircleCheck: () => 'CircleCheck-Icon',
  ChevronDown: () => 'ChevronDown-Icon',
  ChevronUp: () => 'ChevronUp-Icon',
}));

describe('SelectionList', () => {
  const mockItems = [
    {
      label: 'Option 1',
      extra: ['Detail 1', 'Detail 2']
    },
    {
      label: 'Option 2',
      extra: ['Detail 3', 'Detail 4']
    }
  ];
  const mockOnSelect = jest.fn();
  const mockOnContinue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title and no subtitle', () => {
    const { getByText, queryByText } = render(
      <SelectionList
        items={mockItems}
        selectedItem={null}
        onSelect={mockOnSelect}
        onContinue={mockOnContinue}
        title="Test Title"
      />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(queryByText('Option 1')).toBeTruthy();
    expect(queryByText('Option 2')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
    expect(queryByText('Detail 1')).toBeFalsy();
  });

  it('renders with subtitle when provided', () => {
    const { getByText } = render(
      <SelectionList
        items={mockItems}
        selectedItem={null}
        onSelect={mockOnSelect}
        onContinue={mockOnContinue}
        title="Test Title"
        subtitle="Test Subtitle"
      />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Subtitle')).toBeTruthy();
  });

  it('calls onSelect when an item is pressed', () => {
    const { getAllByText } = render(
      <SelectionList
        items={mockItems}
        selectedItem={null}
        onSelect={mockOnSelect}
        onContinue={mockOnContinue}
        title="Test Title"
      />
    );

    const option = getAllByText('Option 1')[0];
    fireEvent.press(option);
    
    expect(mockOnSelect).toHaveBeenCalledWith('Option 1');
  });

  it('shows additional details when an item is selected', () => {
    const { getByText } = render(
      <SelectionList
        items={mockItems}
        selectedItem="Option 1"
        onSelect={mockOnSelect}
        onContinue={mockOnContinue}
        title="Test Title"
      />
    );

    expect(getByText('• Detail 1')).toBeTruthy();
    expect(getByText('• Detail 2')).toBeTruthy();
  });

  it('calls onContinue when the Continue button is pressed', () => {
    const { getByText } = render(
      <SelectionList
        items={mockItems}
        selectedItem={null}
        onSelect={mockOnSelect}
        onContinue={mockOnContinue}
        title="Test Title"
      />
    );

    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);
    
    expect(mockOnContinue).toHaveBeenCalled();
  });

  it('applies correct styling to selected items', () => {
    const { getAllByText } = render(
      <SelectionList
        items={mockItems}
        selectedItem="Option 1"
        onSelect={mockOnSelect}
        onContinue={mockOnContinue}
        title="Test Title"
      />
    );
    
    const selectedText = getAllByText('Option 1')[0];
    
    expect(selectedText.props.className).toContain('text-white');
  });

  it('applies correct styling to unselected items', () => {
    const { getAllByText } = render(
      <SelectionList
        items={mockItems}
        selectedItem="Option 1"
        onSelect={mockOnSelect}
        onContinue={mockOnContinue}
        title="Test Title"
      />
    );
    
    const unselectedText = getAllByText('Option 2')[0];
    
    expect(unselectedText.props.className).toContain('text-gray-700');
  });
});