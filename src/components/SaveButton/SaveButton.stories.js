// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean } from '@storybook/addon-knobs';

import SaveButton from './SaveButton';

export default {
  title: 'Save Button',
  decorators: [withKnobs],
};

export const Default = () => ({
  components: {
    SaveButton,
  },
  props: {
    toggled: {
      default: boolean('Toggled', false),
    },
  },
  template: '<SaveButton :toggled="toggled" />',
});
