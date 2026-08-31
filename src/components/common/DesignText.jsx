import { Fragment } from 'react'

// Design line endings are editorial data, not container-width adjustments.
export default function DesignText({ text }) {
  const lines = text.split('\n')
  if (lines.length === 1) return text
  return lines.map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <><br className="design-line-break" /><span className="design-line-space"> </span></>}
      <span className="design-line">{line}</span>
    </Fragment>
  ))
}
