import { LIKER_LAND_URL_BASE } from '~/constant';
import { checkIsValidISCNId, checkIsValidNFTClassId, parseImageURLFromMetadata } from '~/util/nft';
import {
  apiGetNFTPurchaseInfo,
  apiGetLikerDataByAddress,
  apiGetNFTMetadata,
  getNFTOwners,
} from '~/util/api/api';
import { logTrackerEvent } from '@/util/EventLogger';

const WIDGET_SIZE = {
  WIDTH: 360,
  HEIGHT: 480,
};

export default {
  layout: 'widget',
  data() {
    return {
      widgetScale: 1,
      maxWidgetWidth: WIDGET_SIZE.WIDTH,
    };
  },
  computed: {
    collectButtonLabel() {
      return this.$route.query.cta_button_label || this.$t('cta_nft_collect_button');
    },
    nftPrice() {
      return this.nftCollectingPrice;
    },
    isFixedSize() {
      return !this.$route.query.responsive;
    },
    widgetWidth() {
      return Math.max(this.maxWidgetWidth, WIDGET_SIZE.WIDTH);
    },
    widgetStyle() {
      if (this.isFixedSize) {
        return {
          width: `${this.widgetWidth}px`,
          transform: `scale(${this.widgetScale})`,
          transformOrigin: 'top left',
        };
      }
      return null;
    },
    widgetId() {
      return this.$route.query.wid;
    },
    detailsUrl() {
      return `${LIKER_LAND_URL_BASE}/nft/class/${this.nftClassId}?utm_source=widget`;
    },
    purchaseUrl() {
      return `${this.detailsUrl}?action=collect&utm_source=widget`;
    },
    likeIscnUrl() {
      return `/in/like/iscn/?iscn_id=${encodeURIComponent(
        this.iscnId
      )}&action=like`
    },
  },
  async asyncData({
    redirect,
    error,
    query: { iscn_id: qsIscnId, class_id: qsNftClassId, ...query }
  }) {
    if (qsIscnId) {
      if (!checkIsValidISCNId(qsIscnId)) {
        error({ statusCode: 400, message: 'INVALID_ISCN_ID' });
        return undefined;
      }
    } else if (qsNftClassId) {
      if (!checkIsValidNFTClassId(qsNftClassId)) {
        error({ statusCode: 400, message: 'INVALID_NFT_CLASS_ID' });
        return undefined;
      }
    } else {
      redirect('/');
      return undefined;
    }
    const apiParams = {
      iscnId: qsIscnId,
      classId: qsNftClassId,
    };
    const [
      apiPriceInfoResult,
      apiMetadataResult,
    ] = await Promise.all([
      apiGetNFTPurchaseInfo(apiParams).catch(() => {
        // Redirect to /in/like/iscn?iscn_id=:iscn_id if the ISCN has not been minted NFT
        if (apiParams.iscnId && !apiParams.classId) {
          redirect({
            name: 'in-like-id',
            params: { id: 'iscn' },
            query: { ...query, iscn_id: qsIscnId },
          });
        } else {
          error({ statusCode: 404, message: 'NFT_NOT_MINTED' });
        }
        return {};
      }),
      apiGetNFTMetadata(apiParams).catch(() => ({})),
    ]);
    const {
      iscnId,
      classId: nftClassId,
      currentPrice: nftCollectingPrice,
    } = apiPriceInfoResult?.data?.metadata || {}
    const apiOwnersResult = await getNFTOwners({ classId: nftClassId }).catch(() => ({}));
    const {
      name: contentTitle,
      description: contentDescription,
      image: contentImage = '',
      external_url: contentURL,
      iscn_owner: iscnOwnerAddress,
    } = apiMetadataResult.data || {};
    const { owners = [] } = apiOwnersResult.data || {};
    const nftCollectorCount = owners.length;
    const nftCollectedCount = owners.reduce((acc, o) => acc + o.count, 0);

    const likerDataResult = await apiGetLikerDataByAddress(iscnOwnerAddress).catch(() => ({}));
    const {
      displayName: iscnOwnerDisplayName,
      avatar: iscnOwnerAvatarSrc,
      isCivicLikerTrial: isIscnOwnerCivicLikerTrial,
      isSubscribedCivicLiker: isIscnOwnerSubscribedCivicLiker,
    } = likerDataResult.data || {}

    return {
      contentTitle,
      contentDescription,
      contentImage: parseImageURLFromMetadata(contentImage),
      contentURL,
      iscnId,
      iscnOwnerAddress,
      iscnOwnerDisplayName,
      iscnOwnerAvatarSrc,
      isIscnOwnerCivicLiker: isIscnOwnerSubscribedCivicLiker || isIscnOwnerCivicLikerTrial,
      nftClassId,
      nftCollectingPrice,
      nftCollectedCount,
      nftCollectorCount,
    };
  },
  mounted() {
    // For iframe to resize
    this.resizeListener = window.addEventListener('resize', () => {
      window.requestAnimationFrame(this.handleResizing);
    });
    this.handleResizing();
  },
  beforeDestroy() {
    if (this.resizeListener) {
      window.removeEventListener(this.resizeListener);
    }
  },
  methods: {
    viewNFTDetails() {
      logTrackerEvent(this, 'NFTWidgetAction', 'clickViewNFTDetails', 'clickViewNFTDetails(widget)', 1);
      window.open(
        `${this.detailsUrl}?utm_source=widget`,
        `collect_${this.classId}`
      );
    },
    collectNFT() {
      logTrackerEvent(this, 'NFTWidgetAction', 'clickCollectNFT', 'clickCollectNFT(widget)', 1);
      window.open(
        this.purchaseUrl,
        `collect_${this.classId}`,
        'popup=1,width=768,height=576,top=0,left=0'
      );
    },
    likeISCN() {
      logTrackerEvent(this, 'NFTWidgetAction', 'clickLikeISCN', 'clickLikeISCN(widget)', 1);
      window.open(
        this.likeIscnUrl,
        `like_${this.classId}`,
        'popup=1,width=768,height=576,top=0,left=0'
      );
    },
    notifyParentOfResizing() {
      if (!window.parent || !this.$refs.widget) { return; }
      const {
        scrollWidth: width,
        scrollHeight: height,
      } = this.$refs.widget.$el;
      window.parent.postMessage(
        {
          type: 'likecoin-nft-widget-resize',
          widgetId: this.widgetId,
          width,
          height,
        },
        '*'
      );
    },
    handleResizing() {
      if (this.isFixedSize) {
        const maxWidthScale = window.innerWidth / WIDGET_SIZE.WIDTH;
        const maxHeightScale = window.innerHeight / WIDGET_SIZE.HEIGHT;
        this.maxWidgetWidth = Math.min(
          window.innerWidth,
          window.innerHeight * WIDGET_SIZE.WIDTH / WIDGET_SIZE.HEIGHT
        );
        this.widgetScale = Math.min(1, maxHeightScale, maxWidthScale);
      } else {
        this.notifyParentOfResizing();
      }
    },
  }
};
