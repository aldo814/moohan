import Image from 'next/image'
import ruleBasedQaImage from '../../../assets/images/main/img_technology_rule_based_qa.png'
import nmtTranslationImage from '../../../assets/images/main/img_technology_nmt_translation.png'
import llmTranslationImage from '../../../assets/images/main/img_technology_llm_translation.png'
import llmPostEditingImage from '../../../assets/images/main/img_technology_llm_post_editing.png'
import cloudPlatformImage from '../../../assets/images/main/img_technology_cloud_platform.png'

const technologies = [
  {
    title: 'Rule-Based QA',
    description: 'Completed translation files are precisely reviewed using regular expression-based rules and standardized automated review algorithms to detect errors in numbers, special characters, reference numerals, terminology, style, and more. Translators use this system as a final check before submission, while reviewers use the same system for systematic re-verification during the review stage — providing a dual quality safeguard throughout the entire translation process.',
    image: ruleBasedQaImage,
    width: 883,
    height: 717,
  },
  {
    title: 'NMT-Based Machine Translation',
    description: 'An NMT engine specialized for the patent domain provides machine translation, allowing our expert translators to work quickly and accurately based on this foundation.',
    image: nmtTranslationImage,
    width: 846,
    height: 641,
  },
  {
    title: 'LLM-Based AI Translation',
    description: "The LLM references each client's translation assets (TM/TB) and patent translation style guide to provide customized machine translation, allowing our expert translators to work quickly and accurately based on this foundation.",
    image: llmTranslationImage,
    width: 841,
    height: 597,
  },
  {
    title: 'LLM-Based AI Post-Editing',
    description: "The LLM references each client's translation assets (TM/TB) and patent translation style guide to precisely cross-verify translations for omissions, mistranslations, and contextual inconsistencies, providing revised translations and detailed comments — enabling reviewers to complete their review quickly and accurately.",
    image: llmPostEditingImage,
    width: 1005,
    height: 848,
  },
  {
    title: 'Cloud-Based Translation Platform',
    description: 'From project setup through translation and review, we provide a unified cloud environment integrating TM, TB, and NMT/LLM. Stage-based permission management enables translators and reviewers to collaborate systematically.',
    image: cloudPlatformImage,
    width: 1585,
    height: 971,
  },
]

function ProcessCard({ title, description, tone }) {
  return (
    <div className={`technologies__process-card technologies__process-card--${tone}`}>
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  )
}

function Technologies() {
  return (
    <section className="technologies" id="technologies" aria-labelledby="technologies-title">
      <div className="inner technologies__inner">
        <h2 className="technologies__title" id="technologies-title">TECHNOLOGIES</h2>

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

      <div className="technologies__process" aria-label="Translation technology workflow">
        <div className="inner technologies__process-inner">
          <div className="technologies__process-start">
            <strong>Project Setup</strong>
            <span>Files·TM·TB·AI Engine Connected</span>
          </div>

          <div className="technologies__process-platform">
            <div className="technologies__process-heading">
              <strong>Cloud-Based Translation Platform</strong>
              <span>Unified TM·TB·NMT/LLM Environment</span>
            </div>

            <div className="technologies__process-columns">
              <div className="technologies__process-role">
                <h4>Translator</h4>
                <ProcessCard title="NMT/LLM Translation" description="Initial draft generation" tone="blue" />
                <ProcessCard title="Rule-Based QA" description="Final check before submission" tone="orange" />
              </div>
              <div className="technologies__process-role">
                <h4>Reviewer</h4>
                <ProcessCard title="Rule-Based QA" description="Re-verification during review" tone="orange" />
                <ProcessCard title="LLM Post-Editing" description="Cross-verification & revision provided" tone="purple" />
              </div>
            </div>
          </div>

          <div className="technologies__process-complete">Reviewed Translation Complete</div>
        </div>
      </div>
    </section>
  )
}

export default Technologies
