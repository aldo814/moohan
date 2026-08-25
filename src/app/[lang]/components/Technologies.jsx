import Image from 'next/image'
import ruleBasedQaImage from '../../../assets/images/main/img_technology_rule_based_qa.png'
import nmtTranslationImage from '../../../assets/images/main/img_technology_nmt_translation.png'
import llmTranslationImage from '../../../assets/images/main/img_technology_llm_translation.png'
import llmPostEditingImage from '../../../assets/images/main/img_technology_llm_post_editing.png'
import cloudPlatformImage from '../../../assets/images/main/img_technology_cloud_platform.png'

const technologyImages = [
  { image: ruleBasedQaImage, width: 883, height: 717 },
  { image: nmtTranslationImage, width: 846, height: 641 },
  { image: llmTranslationImage, width: 841, height: 597 },
  { image: llmPostEditingImage, width: 1005, height: 848 },
  { image: cloudPlatformImage, width: 1585, height: 971 },
]

function ProcessCard({ title, description, tone }) {
  return (
    <div className={`technologies__process-card technologies__process-card--${tone}`}>
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  )
}

function Technologies({ dictionary }) {
  const technologies = dictionary.items.map((technology, index) => ({ ...technology, ...technologyImages[index] }))
  return (
    <section className="technologies" id="technologies" aria-labelledby="technologies-title">
      <div className="inner technologies__inner">
        <h2 className="technologies__title" id="technologies-title">{dictionary.title}</h2>

        <div className="technologies__list">
          {technologies.map((technology, index) => (
            <article className={`technologies__item${index % 2 === 1 ? ' technologies__item--reverse' : ''}`} key={technology.title}>
              <div className="technologies__image-wrap">
                <Image className="technologies__image" src={technology.image} alt="" width={technology.width} height={technology.height} />
              </div>
              <div className="technologies__content">
                <h3 className="technologies__item-title">{technology.title}</h3>
                <p className="technologies__description">{technology.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="technologies__process" aria-label={dictionary.workflowLabel}>
        <div className="inner technologies__process-inner">
          <div className="technologies__process-start">
            <strong>{dictionary.projectSetup}</strong>
            <span>{dictionary.connected}</span>
          </div>

          <div className="technologies__process-platform">
            <div className="technologies__process-heading">
              <strong>{dictionary.platform}</strong>
              <span>{dictionary.environment}</span>
            </div>

            <div className="technologies__process-columns">
              <div className="technologies__process-role">
                <h4>{dictionary.translator}</h4>
                <ProcessCard title={dictionary.nmtTranslation} description={dictionary.initialDraft} tone="blue" />
                <ProcessCard title={dictionary.ruleQa} description={dictionary.finalCheck} tone="orange" />
              </div>
              <div className="technologies__process-role">
                <h4>{dictionary.reviewer}</h4>
                <ProcessCard title={dictionary.ruleQa} description={dictionary.reviewCheck} tone="orange" />
                <ProcessCard title={dictionary.llmPostEditing} description={dictionary.revision} tone="purple" />
              </div>
            </div>
          </div>

          <div className="technologies__process-complete">{dictionary.complete}</div>
        </div>
      </div>
    </section>
  )
}

export default Technologies
