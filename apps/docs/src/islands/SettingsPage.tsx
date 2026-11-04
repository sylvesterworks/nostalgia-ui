import {
  Button,
  Card,
  Checkbox,
  CheckboxIndicator,
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
  Menu,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuSeparator,
  MenuTrigger,
  Select,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
  Switch,
  SwitchThumb,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  Tabs,
  Tooltip,
  TooltipArrow,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipTrigger,
} from '@nostalgiaui/react';
import type * as React from 'react';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
] as const;

/**
 * One settings page, built from every component.
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
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox defaultChecked>
                  <CheckboxIndicator />
                </Checkbox>
                Show my email on my profile
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Switch>
                  <SwitchThumb />
                </Switch>
                Show me as online
              </label>
              <Select items={languages} defaultValue="en">
                <div style={{ display: 'grid', justifyItems: 'start' }}>
                  <SelectLabel>Language</SelectLabel>
                  <SelectTrigger>
                    <SelectValue />
                    <SelectIcon />
                  </SelectTrigger>
                </div>
                <SelectPortal>
                  <SelectPositioner>
                    <SelectPopup>
                      <SelectList>
                        {languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            <SelectItemIndicator />
                            <SelectItemText>{language.label}</SelectItemText>
                          </SelectItem>
                        ))}
                      </SelectList>
                    </SelectPopup>
                  </SelectPositioner>
                </SelectPortal>
              </Select>
              <Slider defaultValue={100} min={75} max={150} step={5}>
                <SliderLabel>Text size (%)</SliderLabel>
                <SliderValue />
                <SliderControl>
                  <SliderTrack>
                    <SliderIndicator />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </Slider>
              <div>
                <Menu>
                  <MenuTrigger render={<Button variant="outline" />}>Profile actions</MenuTrigger>
                  <MenuPortal>
                    <MenuPositioner>
                      <MenuPopup>
                        <MenuItem>Copy profile link</MenuItem>
                        <MenuItem>Export data</MenuItem>
                        <MenuSeparator />
                        <MenuItem>Sign out</MenuItem>
                      </MenuPopup>
                    </MenuPositioner>
                  </MenuPortal>
                </Menu>
              </div>
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
        <Tooltip>
          <TooltipTrigger render={<Button variant="solid" />}>Save changes</TooltipTrigger>
          <TooltipPortal>
            <TooltipPositioner sideOffset={8}>
              <TooltipPopup>
                <TooltipArrow />
                Changes show on your public profile right away.
              </TooltipPopup>
            </TooltipPositioner>
          </TooltipPortal>
        </Tooltip>
        <Button variant="ghost">Cancel</Button>
        <Button variant="solid" disabled>
          Saved
        </Button>
      </div>
    </div>
  );
}
