import React from 'react';

const FW = {
  angular: { label: 'Angular', logo: 'fw-angular.svg' },
  react: { label: 'React', logo: 'fw-react.svg' },
  webcomponents: { label: 'Web Components', logo: 'fw-webcomponents.svg' },
  blazor: { label: 'Blazor', logo: 'fw-blazor.svg' },
  winforms: { label: 'Windows Forms', logo: 'fw-windows.svg' },
  wpf: { label: 'WPF', logo: 'fw-windows.svg' },
};

export function FrameworkPill({ framework, href, assetBase = '../assets/logos/', size = 'md', style, ...rest }) {
  const fw = FW[framework] || FW.angular;
  return (
    <a href={href} className="type-body-2" data-ig="framework-pill" data-fw={FW[framework] ? framework : 'angular'} data-size={size} style={style} {...rest}>
      <img src={assetBase + fw.logo} alt="" style={{ height: 'var(--fw-logo-height)', width: 'auto', display: 'block', flex: '0 0 auto' }} />
      {fw.label}
    </a>
  );
}
