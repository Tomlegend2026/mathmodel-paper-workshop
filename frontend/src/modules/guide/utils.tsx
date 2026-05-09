// 引导工具函数
import { Tooltip } from 'antd';
import type { GuideTip } from './config';

/**
 * 创建带引导提示的组件包装器
 * @param component - 要包装的组件
 * @param tip - 引导提示配置
 * @param showTip - 是否显示提示（可以从 localStorage 或用户设置中读取）
 */
export function withGuideTip(
  component: React.ReactNode,
  tip: GuideTip,
  showTip: boolean = true
): React.ReactNode {
  if (!showTip) {
    return component;
  }

  return (
    <Tooltip
      title={
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{tip.title}</div>
          <div>{tip.content}</div>
        </div>
      }
      placement={tip.placement || 'top'}
      color="#2d2d44"
      overlayStyle={{ maxWidth: 300 }}
    >
      {component}
    </Tooltip>
  );
}

/**
 * 检查用户是否已看过某个引导提示
 * @param tipId - 提示ID
 */
export function hasSeenTip(tipId: string): boolean {
  const seenTips = JSON.parse(localStorage.getItem('seenGuideTips') || '[]');
  return seenTips.includes(tipId);
}

/**
 * 标记用户已看过某个引导提示
 * @param tipId - 提示ID
 */
export function markTipAsSeen(tipId: string): void {
  const seenTips = JSON.parse(localStorage.getItem('seenGuideTips') || '[]');
  if (!seenTips.includes(tipId)) {
    seenTips.push(tipId);
    localStorage.setItem('seenGuideTips', JSON.stringify(seenTips));
  }
}

/**
 * 重置所有引导提示（用于测试或重新显示）
 */
export function resetAllTips(): void {
  localStorage.removeItem('seenGuideTips');
}

/**
 * 获取是否应该显示新手引导
 */
export function shouldShowOnboarding(): boolean {
  return !localStorage.getItem('hasCompletedOnboarding');
}

/**
 * 标记新手引导已完成
 */
export function markOnboardingComplete(): void {
  localStorage.setItem('hasCompletedOnboarding', 'true');
}
