import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button/index.js';
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './Dialog.js';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Open on load. DialogPortal renders into the NostalgiaRoot the story sits in,
 * which is why the popup keeps the era and palette.
 */
export const Open: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            DialogTitle comes first: Classic Windows styles it into the title bar.
          </DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  ),
};

/** DialogTrigger and DialogClose take render, so an era-styled Button fills each slot. */
export const StyledTriggerAndClose: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="solid">Open dialog</Button>} />
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>Discard changes?</DialogTitle>
          <DialogDescription>Your edits to this page will be lost.</DialogDescription>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <DialogClose render={<Button variant="ghost">Cancel</Button>} />
            <DialogClose render={<Button variant="danger">Discard</Button>} />
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  ),
};

/**
 * Don't: put DialogDescription before DialogTitle. In Classic Windows the
 * title becomes the title bar, which then sits in the middle of the window.
 * Compare Open.
 */
export const DontTitleAfterDescription: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogDescription>
            The description comes first here, which is the mistake.
          </DialogDescription>
          <DialogTitle>Notifications</DialogTitle>
          <DialogClose>Close</DialogClose>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  ),
};
