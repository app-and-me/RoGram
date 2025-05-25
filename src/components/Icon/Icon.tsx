import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '@/styles/theme';

export interface IconProps {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

const StyledSVG = styled.div<{ width: number; height: number; color: string }>`
  display: inline-flex;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;

  svg {
    width: 100%;
    height: 100%;
    fill: ${({ color }) => color};
  }

  svg path {
    fill: ${({ color }) => color};
  }
`;

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  width,
  height,
  color,
  active = false,
  className,
  onClick,
}) => {
  const [svgContent, setSvgContent] = useState<string>('');

  const finalWidth = width || size;
  const finalHeight = height || size;

  const iconColor =
    color ||
    (active ? theme.Color.Content.Standard.Primary : theme.Color.Content.Standard.Quaternary);

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(`/icons/${name}.svg`);
        const svgText = await response.text();
        setSvgContent(svgText);
      } catch (error) {
        console.error(`Error loading SVG: ${name}.svg`, error);
      }
    };

    loadSvg();
  }, [name]);

  return (
    <StyledSVG
      width={finalWidth}
      height={finalHeight}
      color={iconColor}
      className={className}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default Icon;
