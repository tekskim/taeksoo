import type { ReactElement } from 'react';
import SvgRawIcon, { type SvgIconComponent } from './SvgRawIcon';
import type { SvgIconProps } from './types';

// Only custom SVGs that don't have a Tabler equivalent are imported here.
// All general-purpose icons have been migrated to @tabler/icons-react in wrapped.tsx.

import AddRobotSvg from '../assets/Add robot.svg?component';
import DeviceMobileSvg from '../assets/DeviceMobile.svg?component';
import EnvelopeSvg from '../assets/Envelope.svg?component';
import ExpandOffSvg from '../assets/ExpandOff.svg?component';
import ExpandOnSvg from '../assets/ExpandOn.svg?component';
import HistorySvg from '../assets/History.svg?component';
import IdentifySvg from '../assets/Identify.svg?component';
import ResetSvg from '../assets/Reset.svg?component';
import RockySvg from '../assets/rocky.svg?component';
import SnapBottomSvg from '../assets/SnapBottom.svg?component';
import StatusDeletingSvg from '../assets/StatusDeleting.svg?component';
import StatusInUseSvg from '../assets/StatusInUse.svg?component';
import SnapLeftSvg from '../assets/SnapLeft.svg?component';
import SnapRightSvg from '../assets/SnapRight.svg?component';
import SnapTopSvg from '../assets/SnapTop.svg?component';
import SwitchSvg from '../assets/Switch.svg?component';
import TimeoutSvg from '../assets/Timeout.svg?component';
import UbuntuSvg from '../assets/ubuntu.svg?component';
import WindowCloseSvg from '../assets/WindowClose.svg?component';
import WindowMaximizeSvg from '../assets/WindowMaximize.svg?component';
import WindowMinimizeSvg from '../assets/WindowMinimize.svg?component';

// Sidebar icon (no Tabler equivalent)
import SidebarScalingSvg from '../assets/SidebarScaling.svg?component';
import SidebarNetworkSvg from '../assets/SidebarNetwork.svg?component';

// Compute/Storage icons matching SSOT lucide originals
import RouterSvg from '../assets/Router.svg?component';
import PortsSvg from '../assets/Ports.svg?component';
import FirewallSvg from '../assets/Firewall.svg?component';
import HardDriveSvg from '../assets/HardDrive.svg?component';

function createIcon(Component: SvgIconComponent) {
  return function IconComponent(props: SvgIconProps): ReactElement {
    return <SvgRawIcon Component={Component} {...props} />;
  };
}

// Domain-specific / custom icons
export const ExpandOn = createIcon(ExpandOnSvg);
export const ExpandOff = createIcon(ExpandOffSvg);
export const Switch = createIcon(SwitchSvg);
export const Timeout = createIcon(TimeoutSvg);
export const Reset = createIcon(ResetSvg);
export const Identify = createIcon(IdentifySvg);
export const History = createIcon(HistorySvg);
export const WindowClose = createIcon(WindowCloseSvg);
export const WindowMaximize = createIcon(WindowMaximizeSvg);
export const WindowMinimize = createIcon(WindowMinimizeSvg);
export const Ubuntu = createIcon(UbuntuSvg);
export const Rocky = createIcon(RockySvg);
export const AddRobot = createIcon(AddRobotSvg);

// Status indicator custom icons (SSOT)
export const StatusDeleting = createIcon(StatusDeletingSvg);
export const StatusInUse = createIcon(StatusInUseSvg);

// Snap icons
export const SnapTop = createIcon(SnapTopSvg);
export const SnapBottom = createIcon(SnapBottomSvg);
export const SnapLeft = createIcon(SnapLeftSvg);
export const SnapRight = createIcon(SnapRightSvg);

// Sidebar icon (no Tabler equivalent)
export const SidebarScaling = createIcon(SidebarScalingSvg);
export const SidebarNetwork = createIcon(SidebarNetworkSvg);

// Compute/Storage icons (lucide originals from SSOT)
export const Router = createIcon(RouterSvg);
export const Ports = createIcon(PortsSvg);
export const Firewall = createIcon(FirewallSvg);
export const HardDrive = createIcon(HardDriveSvg);

// MFA icons
export const DeviceMobile = createIcon(DeviceMobileSvg);
export const Envelope = createIcon(EnvelopeSvg);
