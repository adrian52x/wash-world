import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MembershipSelect } from '@/components/MembershipSelect';

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
      extra: ['Detail 1', 'Detail 2'],
    },
    {
      label: 'Option 2',
      extra: ['Detail 3', 'Detail 4'],
    },
  ];
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with subtitle when provided', () => {
    const { getByText } = render(
      <MembershipSelect items={mockItems} selectedItem={null} onSelect={mockOnSelect} subtitle="Test Subtitle" />,
    );

    expect(getByText('Test Subtitle')).toBeTruthy();
  });

  it('calls onSelect when an item is pressed', () => {
    const { getAllByText } = render(
      <MembershipSelect items={mockItems} selectedItem={null} onSelect={mockOnSelect} subtitle="Test Title" />,
    );

    const option = getAllByText('Option 1')[0];
    fireEvent.press(option);

    expect(mockOnSelect).toHaveBeenCalledWith('Option 1');
  });

  it('shows additional details when an item is selected', () => {
    const { getByText } = render(
      <MembershipSelect items={mockItems} selectedItem="Option 1" onSelect={mockOnSelect} subtitle="Test Title" />,
    );

    expect(getByText('• Detail 1')).toBeTruthy();
    expect(getByText('• Detail 2')).toBeTruthy();
  });

  it('applies correct styling to selected items', () => {
    const { getAllByText } = render(
      <MembershipSelect items={mockItems} selectedItem="Option 1" onSelect={mockOnSelect} subtitle="Test Title" />,
    );

    const selectedText = getAllByText('Option 1')[0];

    expect(selectedText.props.className).toContain('text-white');
  });

  it('applies correct styling to unselected items', () => {
    const { getAllByText } = render(
      <MembershipSelect items={mockItems} selectedItem="Option 1" onSelect={mockOnSelect} subtitle="Test Title" />,
    );

    const unselectedText = getAllByText('Option 2')[0];

    expect(unselectedText.props.className).toContain('text-gray-700');
  });
});
