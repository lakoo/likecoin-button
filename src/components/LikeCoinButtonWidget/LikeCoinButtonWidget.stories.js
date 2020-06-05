// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  text,
} from '@storybook/addon-knobs';

import LikeCoinButtonWidget from './LikeCoinButtonWidget';
import LikeButtonV2 from '../LikeButtonV2/LikeButtonV2';
import SaveButton from '../SaveButton/SaveButton';

export default {
  title: 'LikeCoin Button Widget (v2)',
  decorators: [withKnobs],
};

export const Default = () => ({
  components: {
    LikeCoinButtonWidget,
  },
  props: {
    likeButtonLabel: {
      default: text('Like Button Label', '1 LIKE'),
    },
    saveButtonLabel: {
      default: text('Save Button Label', 'Save'),
    },
    avatarLabel: {
      default: text('Avatar Label', 'Follow'),
    },
    avatarURL: {
      default: text('Avatar URL', 'https://avatars.dicebear.com/api/identicon/likecoin.svg'),
    },
    displayName: {
      default: text('Display Name', 'Display Name'),
    },
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        likeButtonLabel,
        saveButtonLabel,
        avatarLabel,
        avatarURL,
        displayName,
      }"
    />
  `,
});


export const Controlled = () => ({
  components: {
    LikeButtonV2,
    LikeCoinButtonWidget,
    SaveButton,
  },
  props: {
    displayName: {
      default: text('Display Name', 'ckxpress'),
    },
  },
  data() {
    return {
      count: 0,
      cooldown: 0,
      hasSuperLiked: false,
      isSaved: false,
    };
  },
  computed: {
    avatarLabel() {
      return this.count >= 1 ? 'Following' : 'Follow';
    },
    avatarURL() {
      return `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(this.displayName)}.svg`;
    },
    saveButtonLabel() {
      return this.isSaved ? 'Saved' : 'Save';
    },
    likeButtonLabel() {
      if (this.count >= 5 && !this.cooldown) {
        return 'Super Like Now';
      }
      return `${this.count + 32} Likes`;
    },
  },
  methods: {
    onClickLikeButton() {
      if (this.count < 5) {
        this.count += 1;
      } else if (!this.cooldown) {
        this.hasSuperLiked = true;
        this.cooldown = 80;
        setTimeout(() => {
          this.fastForwardCooldown();
        }, 3000);
      }
    },
    onClickSaveButton() {
      this.isSaved = !this.isSaved;
    },
    fastForwardCooldown() {
      setTimeout(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 0.2;
          this.fastForwardCooldown();
        } else {
          this.cooldown = 0;
        }
      }, 16);
    },
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        avatarLabel,
        avatarURL,
        displayName,
        likeButtonLabel,
        saveButtonLabel,
      }"
    >
      <template #like-button>
        <LikeButtonV2
          v-bind="{
            cooldown,
            count,
            hasSuperLiked,
          }"
          @click="onClickLikeButton"
        />
      </template>
      <template #save-button>
        <SaveButton
          :toggled="isSaved"
          @click="onClickSaveButton"
        />
      </template>
    </LikeCoinButtonWidget>
  `,
});
