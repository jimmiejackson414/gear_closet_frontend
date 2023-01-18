import { defineStore } from 'pinia';
import { useClient } from '@/lib/graphqlRequest';
import {
  Comment,
  CommentResponse,
  CreateCommentInput,
  CreateReplyInput,
  DeleteCommentResponse,
  DeleteReplyResponse,
  getSdk,
  Maybe,
  Pack,
  PackInput,
  PublicPackResponse,
  Reply,
  ReplyResponse,
  UpdateCommentInput,
  UpdateReplyInput,
  User,
} from '@/generated/types';

type AlertDialog = {
  alertColor?: string;
  btnColor?: string;
  btnText?: string;
  copy1?: string;
  copy2?: string;
  continueCallback: (...args: any) => void;
  hasCancel?: boolean;
  isSubmitting?: boolean;
  open: boolean;
  title: string;
}

type State = {
  publicPack?: PublicPackResponse;
  alertDialog: AlertDialog
}

type Getters = {
  comments: () => Comment[];
  pack: () => Maybe<Pack> | undefined;
  user: () => Maybe<User> | undefined;
}

type Actions = {
  createComment: (input: CreateCommentInput) => Promise<CommentResponse>;
  createReply: (input: CreateReplyInput) => Promise<ReplyResponse>;
  deleteComment: (id: number) => Promise<DeleteCommentResponse>;
  deleteReply: (reply: Reply) => Promise<DeleteReplyResponse>;
  fetchPublicPack: (input: PackInput) => Promise<PublicPackResponse>;
  setAlertDialog: (args: AlertDialog) => void;
  updateComment: (id: number, input: UpdateCommentInput) => Promise<void>
  updateReply: (id: number, input: UpdateReplyInput) => Promise<void>
}

export const usePublicStore = defineStore<'public', State, Getters, Actions>('public', {
  state () {
    return {
      publicPack: undefined,
      alertDialog: {
        alertColor: 'primary',
        btnColor: 'primary',
        btnText: 'Continue',
        copy1: '',
        copy2: '',
        hasCancel: true,
        isSubmitting: false,
        open: false,
        title: '',
        continueCallback: (): void => {
          // do nothing by default
        },
      },
    };
  },

  getters: {
    comments () {
      return (this.publicPack?.pack?.comments as Comment[]) ?? [];
    },
    pack () {
      return this.publicPack?.pack;
    },
    user () {
      return this.publicPack?.user;
    },
  },

  actions: {
    async createComment (input) {
      const client = useClient();
      const sdk = getSdk(client);

      const { createComment } = await sdk.CreateComment({ input });

      if (createComment.comment && !createComment.errors) {
        this.publicPack?.pack?.comments?.push(createComment.comment);
      }

      return createComment;
    },
    async createReply (input) {
      const client = useClient();
      const sdk = getSdk(client);

      const { createReply } = await sdk.CreateReply({ input });

      if (createReply.reply && !createReply.errors) {
        const index = this.publicPack?.pack?.comments?.findIndex(c => c!.id === input.comment_id);
        if (index && index !== -1) {
          this.publicPack?.pack?.comments?.[index]?.replies?.push(createReply.reply);
        }
      }

      return createReply;
    },
    async deleteComment (id) {
      const client = useClient();
      const sdk = getSdk(client);

      const { deleteComment } = await sdk.DeleteComment({ id });

      if (deleteComment.success && !deleteComment.errors) {
        this.publicPack!.pack!.comments = this.publicPack?.pack?.comments?.filter(c => c!.id !== id);

        this.setAlertDialog({
          open: false,
          isSubmitting: false,
          title: '',
          continueCallback: () => {
            // do nothing by default
          },
        });
      }
      return deleteComment;
    },
    async deleteReply (reply) {
      const client = useClient();
      const sdk = getSdk(client);

      const { deleteReply } = await sdk.DeleteReply({ id: reply.id });

      if (deleteReply.success && !deleteReply.errors) {
        const commentIndex = this.publicPack?.pack?.comments?.findIndex(c => c!.id === reply.comment_id);
        if (commentIndex !== -1) {
          const index = this.publicPack?.pack?.comments?.[commentIndex as number]?.replies?.findIndex(r => r!.id === reply.id);
          if (index !== -1) {
            this.publicPack!.pack!.comments![commentIndex as number]!.replies = this.publicPack!.pack!.comments![commentIndex as number]!.replies!
              .filter(r => r!.id !== reply.id);
          }
        }
      }

      this.setAlertDialog({
        open: false,
        isSubmitting: false,
        title: '',
        continueCallback: () => {
          // do nothing by default
        },
      });

      return deleteReply;
    },
    async fetchPublicPack (input) {
      const client = useClient();
      const sdk = getSdk(client);

      const { publicPack } = await sdk.PublicPack({ input });

      if (publicPack.pack) {
        this.publicPack = publicPack;
      }
      return publicPack;
    },
    setAlertDialog (args) {
      this.alertDialog = { ...this.alertDialog, ...args };
    },
    async updateComment (id, input) {
      const client = useClient();
      const sdk = getSdk(client);

      const { updateComment } = await sdk.UpdateComment({ id, input });

      if (updateComment.comment && !updateComment.errors) {
        const commentIndex = this.publicPack?.pack?.comments?.findIndex(c => c!.id === id);
        if (commentIndex !== -1) {
          this.publicPack!.pack!.comments![commentIndex as number] = updateComment.comment;
        }
      }
    },
    async updateReply (id, input) {
      const client = useClient();
      const sdk = getSdk(client);

      const { updateReply } = await sdk.UpdateReply({ id, input });

      if (updateReply.reply && !updateReply.errors) {
        const commentIndex = this.publicPack?.pack?.comments?.findIndex(c => c!.id === updateReply.reply!.comment_id);
        if (commentIndex !== -1) {
          const index = this.publicPack?.pack?.comments?.[commentIndex as number]?.replies?.findIndex(r => r!.id === updateReply.reply!.id);
          if (index !== -1) {
            this.publicPack!.pack!.comments![commentIndex as number]!.replies![index as number] = updateReply.reply;
          }
        }
      }
    },
  },
});
