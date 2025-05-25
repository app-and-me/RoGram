import theme from './theme';

export type FontFamily = 'normal' | 'code';
export type FontWeight = 'regular' | 'strong';
export type StyleType = 'Display' | 'Title' | 'Heading' | 'Body' | 'Label' | 'Footnote' | 'Caption';

interface StyleProps {
  size: string;
  lineHeight: string;
}

const styleProps: Record<StyleType, StyleProps> = {
  Display: {
    size: theme.Typography.Size.Display,
    lineHeight: theme.Typography.LineHeight.Display,
  },
  Title: {
    size: theme.Typography.Size.Title,
    lineHeight: theme.Typography.LineHeight.Title,
  },
  Heading: {
    size: theme.Typography.Size.Heading,
    lineHeight: theme.Typography.LineHeight.Heading,
  },
  Body: {
    size: theme.Typography.Size.Body,
    lineHeight: theme.Typography.LineHeight.Body,
  },
  Label: {
    size: theme.Typography.Size.Label,
    lineHeight: theme.Typography.LineHeight.Label,
  },
  Footnote: {
    size: theme.Typography.Size.Footnote,
    lineHeight: theme.Typography.LineHeight.Footnote,
  },
  Caption: {
    size: theme.Typography.Size.Caption,
    lineHeight: theme.Typography.LineHeight.Caption,
  },
};

const fontWeights = {
  normal: {
    regular: theme.Style.Weight.Regular.Normal,
    strong: theme.Style.Weight.Strong.Normal,
  },
  code: {
    regular: theme.Style.Weight.Regular.Code,
    strong: theme.Style.Weight.Strong.Code,
  },
};

const createTypography = (
  size: string,
  lineHeight: string,
  weight: string,
  fontFamilyType: FontFamily
) => {
  return {
    fontFamily: fontFamilyType === 'normal' ? theme.Style.Family.Normal : theme.Style.Family.Code,
    fontSize: `${size}px`,
    lineHeight: `${lineHeight}px`,
    fontWeight: weight,
  };
};

export const typo = Object.entries(styleProps).reduce(
  (acc, [styleType, props]) => {
    const { size, lineHeight } = props;
    const styleKey = styleType as StyleType;

    return {
      ...acc,
      [styleKey]: {
        Regular: createTypography(size, lineHeight, fontWeights.normal.regular, 'normal'),
        Strong: createTypography(size, lineHeight, fontWeights.normal.strong, 'normal'),
        CodeRegular: createTypography(size, lineHeight, fontWeights.code.regular, 'code'),
        CodeStrong: createTypography(size, lineHeight, fontWeights.code.strong, 'code'),
      },
    };
  },
  {} as Record<
    StyleType,
    {
      Regular: ReturnType<typeof createTypography>;
      Strong: ReturnType<typeof createTypography>;
      CodeRegular: ReturnType<typeof createTypography>;
      CodeStrong: ReturnType<typeof createTypography>;
    }
  >
);

export default typo;
