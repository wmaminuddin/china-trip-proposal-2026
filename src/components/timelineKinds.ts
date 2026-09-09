import type { DayKind } from '../data/options'

export const kindClassMap: Record<DayKind, string> = {
  travel: 'kind-travel',
  fair: 'kind-fair',
  transfer: 'kind-transfer',
  LRVTC: 'kind-LRVTC',
  buffer: 'kind-buffer',
  debrief: 'kind-debrief',
}
