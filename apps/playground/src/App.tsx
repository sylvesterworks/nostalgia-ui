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
  NostalgiaRoot,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  Tabs,
} from '@nostalgiaui/react';
import { eras, palettes } from '@nostalgiaui/tokens';
import { useState } from 'react';

/**
 * The milestone's proof.
 *
 * Switching era or palette changes exactly two attributes on one wrapper
 * element. No component re-renders differently, no conditional markup, and no
 * JavaScript theme object: the whole visual change is CSS resolving different
 * custom properties.
 */
export function App(): React.ReactElement {
  const [era, setEra] = useState<string>(eras[0]?.id ?? '');
  const [palette, setPalette] = useState<string>(palettes[0]?.id ?? '');

  return (
    <>
      <header className="pg-Controls">
        <h1 className="pg-Title">NostalgiaUI</h1>

        <label className="pg-Field">
          <span>Era</span>
          <select value={era} onChange={(event) => setEra(event.target.value)}>
            {eras.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} ({option.period})
              </option>
            ))}
          </select>
        </label>

        <label className="pg-Field">
          <span>Palette</span>
          <select value={palette} onChange={(event) => setPalette(event.target.value)}>
            {palettes.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <code className="pg-Readout">
          data-era=&quot;{era}&quot; data-palette=&quot;{palette}&quot;
        </code>
      </header>

      {/* NostalgiaRoot sets the two attributes that do all the work, and is
          also what portalled parts such as Dialog render back into. */}
      <NostalgiaRoot era={era} palette={palette} className="pg-Stage">
        <section className="pg-Row">
          <Button variant="solid">Solid</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="solid" disabled>
            Disabled
          </Button>
        </section>

        <section className="pg-Row pg-Row--stack">
          <Input placeholder="Your name" defaultValue="" />
          <Input placeholder="Invalid field" invalid defaultValue="not an email" />
        </section>

        <section className="pg-Row">
          <Card>
            <CardTitle>Flush card</CardTitle>
            <CardBody>Sits level with the surface it is on.</CardBody>
          </Card>
          <Card elevated>
            <CardTitle>Elevated card</CardTitle>
            <CardBody>
              Elevation is an era decision. Flat / Metro refuses shadows, so it distinguishes this
              by fill instead.
            </CardBody>
          </Card>
        </section>

        <section className="pg-Row pg-Row--stack">
          <Tabs defaultValue="eras">
            <TabList>
              <Tab value="eras">Eras</Tab>
              <Tab value="palettes">Palettes</Tab>
              <Tab value="rules">Rules</Tab>
              {/* Indicator lives inside List: it positions itself from the
                  active tab's geometry, which only List knows. */}
              <TabIndicator />
            </TabList>
            <TabPanel value="eras">
              Era controls shape and feel: radius, borders, bevels, shadows, gradients, type,
              density and motion.
            </TabPanel>
            <TabPanel value="palettes">
              Palette controls colour, and nothing else. Colours come from VS Code themes.
            </TabPanel>
            <TabPanel value="rules">
              Any palette must work in any era. A change that couples them is the wrong change.
            </TabPanel>
          </Tabs>
        </section>

        <section className="pg-Row">
          <Dialog>
            <DialogTrigger render={<Button variant="solid">Open dialog</Button>} />
            <DialogPortal>
              <DialogBackdrop />
              <DialogPopup>
                <DialogTitle>Notifications</DialogTitle>
                <DialogDescription>
                  Classic Windows styles this title into a filled title bar. The markup is identical
                  in every era; only the CSS differs.
                </DialogDescription>
                <div className="pg-DialogActions">
                  <DialogClose render={<Button variant="ghost">Cancel</Button>} />
                  <DialogClose render={<Button variant="solid">Got it</Button>} />
                </div>
              </DialogPopup>
            </DialogPortal>
          </Dialog>
        </section>
      </NostalgiaRoot>
    </>
  );
}
