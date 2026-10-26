import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Input,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  Tabs,
} from '@nostalgiaui/react';
import type * as React from 'react';

/**
 * One settings page, built from the five components.
 *
 * This is the demo target from the brief, written once. Every gallery and the
 * timeline render this same tree; nothing in it knows which era or palette it
 * is inside. That is the claim the whole site exists to demonstrate, so the
 * markup must stay identical across every rendering.
 */
export function SettingsPage(): React.ReactElement {
  return (
    <div style={{ display: 'grid', gap: '1.25rem', maxWidth: '40rem' }}>
      <Tabs defaultValue="profile">
        <TabList>
          <Tab value="profile">Profile</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="danger">Danger zone</Tab>
          <TabIndicator />
        </TabList>

        <TabPanel value="profile">
          <Card>
            <CardTitle>Profile</CardTitle>
            <CardBody>How you appear to other people.</CardBody>
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.75rem' }}>
              <Input placeholder="Display name" defaultValue="Ada" />
              <Input placeholder="Email" defaultValue="ada@example.com" />
              <Input placeholder="Website" defaultValue="not a url" invalid />
            </div>
          </Card>
        </TabPanel>

        <TabPanel value="notifications">
          <Card elevated>
            <CardTitle>Notifications</CardTitle>
            <CardBody>Choose what reaches you and how.</CardBody>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <Button variant="solid">Email digest</Button>
              <Button variant="outline">Push</Button>
              <Button variant="ghost">None</Button>
            </div>
          </Card>
        </TabPanel>

        <TabPanel value="danger">
          <Card>
            <CardTitle>Danger zone</CardTitle>
            <CardBody>These actions cannot be undone.</CardBody>
            <div style={{ marginTop: '0.75rem' }}>
              <Dialog>
                <DialogTrigger render={<Button variant="danger">Delete account</Button>} />
                <DialogPortal>
                  <DialogBackdrop />
                  <DialogPopup>
                    <DialogTitle>Delete account</DialogTitle>
                    <DialogDescription>
                      This removes your profile and every setting on this page.
                    </DialogDescription>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.5rem',
                        padding: '0 1.5rem 1.5rem',
                      }}
                    >
                      <DialogClose render={<Button variant="ghost">Keep it</Button>} />
                      <DialogClose render={<Button variant="danger">Delete</Button>} />
                    </div>
                  </DialogPopup>
                </DialogPortal>
              </Dialog>
            </div>
          </Card>
        </TabPanel>
      </Tabs>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button variant="solid">Save changes</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="solid" disabled>
          Saved
        </Button>
      </div>
    </div>
  );
}
