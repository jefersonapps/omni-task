import { FunctionComponent, SVGProps } from "react";
import Apple from "../../../../assets/icons/apple.svg";
import BlueSky from "../../../../assets/icons/bluesky.svg";
import Facebook from "../../../../assets/icons/facebook.svg";
import Gmail from "../../../../assets/icons/gmail.svg";
import Instagram from "../../../../assets/icons/instagram.svg";
import LinkedIn from "../../../../assets/icons/linkedin.svg";
import Netflix from "../../../../assets/icons/netflix.svg";
import Spotify from "../../../../assets/icons/spotify.svg";
import Steam from "../../../../assets/icons/steam.svg";
import Telegram from "../../../../assets/icons/telegram.svg";
import Twitch from "../../../../assets/icons/twitch.svg";
import Twitter from "../../../../assets/icons/twitter.svg";
import Windows11 from "../../../../assets/icons/windows-11.svg";
import X from "../../../../assets/icons/x.svg";
import YouTube from "../../../../assets/icons/youtube.svg";

export const images: Record<
  string,
  FunctionComponent<SVGProps<SVGSVGElement>>
> = {
  apple: Apple,
  bluesky: BlueSky,
  facebook: Facebook,
  gmail: Gmail,
  instagram: Instagram,
  linkedin: LinkedIn,
  netflix: Netflix,
  spotify: Spotify,
  steam: Steam,
  telegram: Telegram,
  twitch: Twitch,
  twitter: Twitter,
  windows: Windows11,
  x: X,
  youtube: YouTube,
};
