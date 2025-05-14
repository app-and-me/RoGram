const theme = {
  Color: {
    Solid: {
      Red: '#FF4035',
      Orange: '#FF9A05',
      Yellow: '#F5C905',
      Green: '#32CC58',
      Blue: '#057FFF',
      Indigo: '#5B59DE',
      Purple: '#B756E8',
      Pink: '#FF325A',
      Brown: '#A78963',
      Black: '#000000',
      White: '#FFFFFF',
      Translucent: {
        Red: 'rgba(255, 64, 53, 0.5)',
        Orange: 'rgba(255, 154, 5, 0.5)',
        Yellow: 'rgba(245, 201, 5, 0.5)',
        Green: 'rgba(50, 204, 88, 0.5)',
        Blue: 'rgba(5, 127, 255, 0.5)',
        Indigo: 'rgba(91, 89, 222, 0.5)',
        Purple: 'rgba(183, 86, 232, 0.5)',
        Pink: 'rgba(255, 50, 90, 0.5)',
        Brown: 'rgba(167, 137, 99, 0.5)',
      },
    },
    Background: {
      Standard: {
        Primary: '#FFFFFF',
        Secondary: '#EDEEF2',
      },
      Inverted: {
        Primary: '#000000',
        Secondary: '#0E0E0F',
      },
    },
    Content: {
      Standard: {
        Primary: '#292A2E',
        Secondary: 'RGBA(41, 42, 46, 0.7)',
        Tertiary: 'RGBA(41, 42, 46, 0.5)',
        Quaternary: 'RGBA(41, 42, 46, 0.3)',
      },
      Inverted: {
        Primary: '#F4F4F5',
        Secondary: 'RGBA(244, 244, 245, 0.7)',
        Tertiary: 'RGBA(244, 244, 245, 0.5)',
        Quaternary: 'RGBA(244, 244, 245, 0.3)',
      },
    },
    Line: {
      Divider: 'RGBA(121, 124, 138, 0.16)',
      Outline: 'RGBA(121, 124, 138, 0.12)',
    },
    Components: {
      Fill: {
        Standard: {
          Primary: '#FAFAFA',
          Secondary: '#F7F7F7',
          Tertiary: '#F0F0F0',
        },
        Inverted: {
          Primary: '#131314',
          Secondary: '#161617',
          Tertiary: '#1B1C1D',
        },
      },
      Interactive: {
        Hover: 'RGBA(41, 42, 46, 0.08)',
        Focussed: 'RGBA(41, 42, 46, 0.12)',
        Pressed: 'RGBA(41, 42, 46, 0.16)',
      },
      Translucent: {
        Primary: 'rgba(121, 124, 138, 0.1)',
        Secondary: 'rgba(121, 124, 138, 0.08)',
        Tertiary: 'rgba(121, 124, 138, 0.06)',
      },
    },
    Core: {
      Accent: '#5472EB',
      AccentTranslucent: 'rgba(84, 114, 235, 0.1)',
      Status: {
        Positive: '#32CC58',
        Warning: '#F5C905',
        Negative: '#FF4035',
      },
    },
    Syntax: {
      Comment: 'RGBA(41, 42, 46, 0.5)',
      Function: '#5B59DE',
      Variable: '#E08804',
      String: '#2BAD4B',
      Constant: '#057FFF',
      Operator: '#B756E8',
      Keyword: '#FF325A',
    },
  },
  Component: {
    Radius: {
      100: '4',
      200: '6',
      300: '8',
      400: '12',
      500: '14',
      600: '16',
      700: '20',
      800: '24',
    },
    Spacing: {
      50: '2',
      100: '4',
      150: '6',
      200: '8',
      300: '12',
      400: '16',
      500: '20',
      550: '24',
      600: '28',
      700: '32',
      770: '36',
      800: '40',
      850: '48',
      900: '64',
      950: '72',
      1000: '80',
    },
  },
  Style: {
    Family: {
      Normal: 'Wanted Sans Variable',
      Code: 'goorm Sans',
    },
    Weight: {
      Regular: {
        Normal: '500',
        Code: '400',
      },
      Strong: {
        Normal: '700',
        Code: '700',
      },
    },
  },
  Typography: {
    Size: {
      Display: '48',
      Title: '24',
      Heading: '20',
      Body: '16',
      Label: '14',
      Footnote: '12',
      Caption: '10',
    },
    LineHeight: {
      Display: '64',
      Title: '32',
      Heading: '28',
      Body: '24',
      Label: '22',
      Footnote: '20',
      Caption: '16',
    },
    ParagraphSpacing: {
      Body: '2',
      Label: '2',
    },
  },
};

export default theme;
