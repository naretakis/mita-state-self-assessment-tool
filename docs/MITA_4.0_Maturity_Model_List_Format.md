# MITA 4.0 Maturity Model (List Format)

## Version History

| Version | Date           | Author             | Notes                              |
| ------- | -------------- | ------------------ | ---------------------------------- |
| 0.1     | August 8, 2025 | Z. Rioux, S. Lucas | Initial Release for pilot approval |

---

## Table of Contents

- [1 Document Overview](#1-document-overview)
  - [1.1 Document Purpose](#11-document-purpose)
  - [1.2 Audience](#12-audience)
- [2 Model Overview](#2-model-overview)
  - [2.1 Maturity Model Purpose](#21-maturity-model-purpose)
  - [2.2 Maturity Model Goals](#22-maturity-model-goals)
  - [2.3 Maturity Model Methodology and Guiding Principles](#23-maturity-model-methodology-and-guiding-principles)
  - [2.4 Maturity Model Levels and Definitions](#24-maturity-model-levels-and-definitions)
  - [2.5 Using the MITA Maturity Model in the MITA 4.0 Framework](#25-using-the-mita-maturity-model-in-the-mita-40-framework)
- [3 Maturity Profile](#3-maturity-profile)
- [4 Pilot Approach](#4-pilot-approach)
- [5 Maturity Criteria](#5-maturity-criteria)
  - [5.1 Outcomes (Optional)](#51-outcomes-optional)
  - [5.2 Roles (Optional)](#52-roles-optional)
  - [5.3 Business Architecture](#53-business-architecture)
  - [5.4 Information and Data](#54-information-and-data)
  - [5.5 Technology](#55-technology)
- [6 Using Personas](#6-using-personas)
- [Appendix A Maturity Profile Template](#appendix-a-maturity-profile-template)

---

## 1 Document Overview

### 1.1 Document Purpose

The Medicaid Information Technology Architecture (MITA) 4.0 Maturity Model reference document was developed to formalize the framework for the MITA 4.0 Maturity Model (MMM), present its maturity criteria, and gather feedback from stakeholders.

### 1.2 Audience

The primary audience for this document includes but is not limited to:

- MITA 4.0 NextGen Members
- MITA 4.0 State Self-Assessment (SS-A) Workgroup Members
- MITA Governance Board
- Centers for Medicare & Medicaid Services (CMS)

---

## 2 Model Overview

### 2.1 Maturity Model Purpose

The MITA Maturity Model provides State Medicaid Agencies (SMA) with a framework to systematically assess, benchmark, and improve processes, capabilities, architecture, and performance. The MMM offers SMAs a clear path to assess maturity, target specific areas for improvement, and achieve greater efficiency and effectiveness in delivery of Medicaid Program services.

### 2.2 Maturity Model Goals

1. **Align with Strategic Objectives:** Help ensure state capabilities directly support SMA goals.
2. **Drive Standardization, Efficiency, and Consistency:** Standardize and streamline processes across a SMA.
3. **Enable Effective Transformation:** Enable transformative and higher-quality outcomes with greater effectiveness and performance.
4. **Optimize Resource Use and Integrate with MES Operations:** Maximize impact while minimizing waste.
5. **Strengthen Risk Management:** Increase the capability to identify and mitigate risks.
6. **Enable Measurable Progress:** Provide measures to track improvement over time.

### 2.3 Maturity Model Methodology and Guiding Principles

To create the MITA 4.0 Maturity Model, the MITA Governance Board initiated a MITA 4.0 Maturity Model workstream tasked with the completion of the following deliverables:

1. Develop a MITA 4.0 Maturity Model.
2. Draft a MITA 4.0 Maturity Model Reference Guide that provides an overview of the MITA 4.0 approach to develop the MMM.
3. Collaborate with other workgroups to develop maturity criteria for the MMM based on the MITA 4.0 approach to using the SS-A for assessing the maturity of a capability and how well the SMA performs that capability. Capabilities will be assessed based on the outcomes (O), roles (R), business processes (B), information (I), and technology (T) (ORBIT) that a SMA has defined and implemented to support that capability. Maturity criteria are organized using the ORBIT framework.
4. Collaborate with other workgroups to develop a high-level overview of the MITA 4.0 process to better understand how to conduct the MMM and the MITA 4.0 SS-A.

To complete these four deliverables, the MMM Workstream carried out the following activities:

- **Phase 1 Initiation (October-December 2024):** Identification of team members and definition of the workgroup's purpose, goals, and approach. This phase also included defining MITA maturity and socialization of the workgroup's purpose, goals, and approach.

- **Phase 2 Fact-finding and Visioning (November-January 2025):** Conduct fact-finding with the Medicaid Governance Board (MGB), MITA 4.0 workgroups, and SMAs to understand SMA feedback on MITA 3.0's maturity model as well as the opportunities for improvement with MITA 4.0. Phase 2 included a detailed review of MITA 3.0's definition of maturity as well as other MITA 4.0 workgroups' plans for the MITA 4.0 Maturity Model. The Workstream researched more than 60 industry-recognized maturity models to help determine which models might be leveraged for MITA 4.0. This effort also encompassed visioning sessions and efforts by The MITRE Corporation (MITRE) team to develop a draft MMM Scale for use by the MMM workgroup.

- **Phase 3 Finalize MITA 4.0 Maturity Model (June-October 2025):** Socialize the draft MMM Scale, gather feedback, and develop both the MMM levels and supporting criteria with other MITA 4.0 workgroups. The draft of this document was part of Phase 3.

- **Phase 4 Pilot MMM and Supporting Documentation (November 2025-March 2026):** Socialize the MMM and supporting documentation with SMAs to gather their feedback and understand how the MMM aligns with the SMAs' MITA 4.0 goals.

During Phase 2, the MMM Workstream consulted SMA users of the MITA 3.0 Maturity Models to understand their desired changes for the MITA 4.0 Maturity Model. Based on SMA responses, findings from review of other industry-recognized maturity models, and feedback from other MITA 4.0 workgroups, the MMM Workstream selected The Open Group Architecture Framework (TOGAF) as the baseline maturity model for the MITA 4.0 Maturity Model. The team drew from TOGAF's maturity model to best align its guidance to best serve SMAs.

The resulting MITA 4.0 Maturity Model retained or incorporated the following details:

- Include five levels of maturity
- Add key words or descriptors to each maturity level to help users further understand the SMA's maturity progression
- Allow for a "non-applicable" assessment rating that does not factor into maturity ratings
- Assess maturity for the individual MITA capability area
- Allow SMAs to average maturity scores and not tie the maturity rating to the lowest level of maturity. By averaging maturity scores, SMAs can demonstrate incremental progress across capability areas
- Enable assessment of levels beginning at the lowest possible state (non-compliance) and ending at the highest possible state (innovation and pioneering)
- Present maturity criteria for each maturity level
- Ensure that maturity criteria address documentation, processes, technology, and/or systems that support:
  - Level One – a commitment to perform
  - Level Two – an ability to perform
  - Level Three – the activities performed
  - Level Four – the ability to measure and analyze
  - Level Five – the ability to implement, improve, and innovate
- Maturity criteria should be part of the SS-A process to:
  - Assess current maturity levels
  - Identify gaps and desired to-be states
  - Populate the Outcomes-Based Planning process template
  - Inform Medicaid Enterprise Systems (MES) initiatives and the supporting Advance Planning Documents

### 2.4 Maturity Model Levels and Definitions

**Level 1 (Initial):** SMA seeks to adopt enterprise-wide planning and architectural frameworks to improve program delivery. Current processes are unstructured, reactive, and inconsistent.

**Level 2 (Developing):** SMA complies with federal regulations and guidance and has begun adopting MES industry-recognized planning and architectural frameworks. Basic processes and systems exist but are not fully standardized or documented. The SMA collects and reports state-specific and MES metrics as well as performance data

**Level 3 (Defined):** SMA complies with federal regulations and guidance and has fully implemented MES industry-recognized planning and architectural frameworks. Processes, systems, and strategies are standardized, well-documented, and aligned across the organization. The SMA actively monitors and analyzes state-specific and MES metrics as well as performance data for improvements.

**Level 4 (Managed):** SMA maintains compliance, follows industry-recognized planning and architectural frameworks, and monitors MES performance to meet goals. Processes are fully operational, consistent, and well executed. The SMA actively monitors and analyzes state-specific and MES metrics as well as performance data for improvements. The organization is a thought-leader in the MES ecosystem and actively collaborates and shares approaches with other SMAs

**Level 5 (Optimized):** The SMA employs advanced, data-driven strategies to manage MES planning and architecture to align predictive decision-making with the SMA's long-term goals. Integrated processes, technologies, and data drive enterprise optimization. The SMA's institutionalized innovation supports adaptability, scalability, and continuous improvement. The organization is nationally recognized and actively collaborates and shares solutions with other SMAs.

**Not Applicable:** Some maturity criteria are inapplicable to certain SMA business operations or MES.

### 2.5 Using the MITA Maturity Model in the MITA 4.0 Framework

#### Background on MITA 4.0 Capabilities and the Capability Reference Model

A capability is defined as an ability that a SMA possesses or seeks to develop to achieve its goals and meet its desired outcomes. It represents what the SMA can do but without attempting to explain how, why or where the SMA uses the capability. A capability may exist within the SMA today or may be required to pursue a new direction or reach a new desired outcome as shown in Figure 1.

In MITA 4.0, each capability consists of the following:

- **O**utcomes – The definition of the desired outcomes that require the capability to be achieved
- **R**oles – The individual roles responsible for providing the capability
- **B**usiness Processes – The business processes performed to deliver the capability
- **I**nformation – The information and the data management capabilities needed to deliver the capability
- **T**echnology – The technology used to automate the capability

A _capability reference model_ is an abstract framework that defines concepts used for grouping capabilities with a common meaning. The reference model establishes a shared definition of capability concepts that can cross organizational boundaries and helps to identify opportunities for sharing, leveraging, and reuse.

The MITA 4.0 Capability Reference Model facilitates identifying the essential capability concepts to support the Medicaid Program and achieve the goals and outcomes established for MITA 4.0. The MITA 4.0 Capability Reference Model consists of two levels:

- **Capability Domain** – High-level capability to group common capabilities
- **Capability Area** – Detailed capabilities that decompose the capability domain into sub-capabilities that SMAs can use to classify their capabilities. Each Capability Domain has one-to-many distinct capability areas.

_[Figure 1: MITA 4.0 Capability Reference Model Structure]_

The Capability Reference Model Document provides more detail about the framework for MITA 4.0 capabilities.

#### MITA 4.0 Capabilities and Maturity Assessment

MITA 4.0 focuses on the capability that a SMA possesses or seeks to develop and is agnostic of how well the SMA performs that capability. The purpose of the state self-assessment is to assess the maturity of the state's capability and how well the SMA performs the capability based on the outcomes, roles, business processes, business information, and technology architectures that a SMA has defined and implemented to support that capability.

---

## 3 Maturity Profile: A Standardized View of Maturity Assessment Results

The SMA should document the results of all maturity assessments in the Maturity Profile. This documentation presents a concise, standardized view of the state's self-assessment. CMS requests that SMAs document their results in a standard format to support CMS's national view of maturity across all states and territories. To that end, CMS provides the Maturity Profile template in spreadsheet format for documenting maturity assessment results. SMAs can save the spreadsheet template as a .csv file for uploading to the MES Hub (MESH). Appendix A presents a sample Maturity Profile for submitting standardized maturity assessment results. The spreadsheet template format will be available for download on the MITA 4.0 Guidance site.

SMAs can use the proof-of-concept SS-A Tool to produce a Maturity Profile that conforms to the CMS spreadsheet template and employs the requisite .csv file for uploading into MESH.

If the SMA uses another tool or method to collate maturity assessment results, the SMA should provide those results to CMS in a format conforming to the Maturity Profile format via a .csv file.

**Proposed delivery of MITA 4.0 SS-A Documentation to CMS:**

> SMAs should upload their maturity assessment results in a format that conforms to the standardized view provided in the Maturity Profile template. A .csv file should be generated to import into MESH. Once the .csv file is imported, a state should notify their State Officer that the file is available on MESH.

---

## 4 Pilot Approach for Determining MITA 4.0 Maturity Assessment

The maturity criteria for Outcomes, Roles, and the Business, Information, and Data architectures will be incorporated into the proof-of-concept SS-A Tool. The MMM Workstream will collect assessment scores using the proof-of-concept SS-A Tool for automated scoring. Pilot SMAs will use the tool to produce an output that conforms to CMS requirements for a standardized view.

---

## 5 Maturity Criteria

MITA 4.0 maturity criteria are organized using the ORBIT framing.

---

### 5.1 Outcomes (Optional)

The following Outcomes maturity criteria are optional for adoption and use by the states. These criteria provide guidance and examples of the qualities and practices currently employed in an outcomes-oriented organization.

#### Culture & Mindset

_Organizational norms, expectations, and behaviors related to outcome development._

**Level 1 (Initial)**

- No culture or expectation of outcomes for projects (at any phase of the project)

**Level 2 (Developing)**

- Recognition begins to take hold of the importance of outcomes during planning

**Level 3 (Defined)**

- Leadership sets expectations
- Outcome development during planning becomes a norm

**Level 4 (Managed)**

- Outcome development is formalized and institutionally expected

**Level 5 (Optimized)**

- Outcome thinking is fully embedded at all levels of organization—without direction by or requirement from leadership

#### Capability

_The internal capacity to develop, oversee, and apply outcomes without reliance on vendors._

**Level 1 (Initial)**

- No internal capabilities to identify or draft outcomes

**Level 2 (Developing)**

- Organization understands at a high-level what elements are needed to identify and draft outcomes, but vendor leads development of outcomes

**Level 3 (Defined)**

- Sufficient experience in identifying and drafting outcomes internally
- Organization may lead or closely oversee vendors to draft outcomes

**Level 4 (Managed)**

- Full in-house capability to independently produce outcomes

**Level 5 (Optimized)**

- Deep in-house expertise with fully self-sufficient teams across the organization
- Organization may also support sister organizations and agencies in developing outcomes

#### Quality & Consistency

_The clarity, structure, and strategic alignment of outcome statements._

**Level 1 (Initial)**

- Outcomes are ambiguous, inconsistent, and disconnected from goals

**Level 2 (Developing)**

- No consistent approach or methodology to developing outcomes
- Outcomes may be aligned with priorities but are not "smart" or actionable

**Level 3 (Defined)**

- Defined approach or methodology to developing outcomes
- Outcomes capture the capability sought and benefit derived from a given project, but the quality of the outcome statements vary

**Level 4 (Managed)**

- Well-established and consistently applied approach to developing outcomes
- Outcomes are clear, actionable, reusable, and strategically aligned

**Level 5 (Optimized)**

- Well-established and consistently applied approach to developing outcomes
- Outcome statements are of consistently high quality, recognizable, and standardized

#### Alignment to Goals & Priorities

_The extent to which outcomes are traceable to broader goals, priorities, and mission._

**Level 1 (Initial)**

- Outcomes are not aligned to goals or priorities

**Level 2 (Developing)**

- Emerging awareness of need to align outcomes with goals and priorities but gaps remain

**Level 3 (Defined)**

- Outcomes are intentionally aligned to strategic goals and priorities

**Level 4 (Managed)**

- Systematic alignment of outcomes to goals and priorities
- Outcomes inform broader strategies

**Level 5 (Optimized)**

- Outcomes reflect and reinforce strategic direction seamlessly

#### Use of Metrics

_How outcomes are tracked, and metrics are used to measure progress and guide improvement._

**Level 1 (Initial)**

- No recognition of the need to measure progress toward achieving outcomes or commitment to continuous improvement

**Level 2 (Developing)**

- Interest in measuring progress toward achieving outcomes
- Metrics are not well-aligned with outcomes

**Level 3 (Defined)**

- Metrics are generally appropriate and regularly referenced to determine progress in achieving outcomes
- Some engagement in continuous improvement cycles

**Level 4 (Managed)**

- Metrics are well-developed
- Staff regularly use metrics to evaluate performance and engage in well-established continuous improvement cycles

**Level 5 (Optimized)**

- Performance monitoring is deeply embedded in organization's culture
- Metrics and outcomes support continuous improvement, learning, and decision-making

#### Reusability & Integration

_Whether outcomes are reused across project documents, Advance Planning Documents (APD), systems, and reporting._

**Level 1 (Initial)**

- No reuse
- Outcomes are informal or nonexistent

**Level 2 (Developing)**

- Reuse is isolated to APDs
- No reuse across other project, planning, or leadership documents

**Level 3 (Defined)**

- Reuse is focused on APDs and some project-related documents
- Inconsistent reuse across leadership documents and external communications

**Level 4 (Managed)**

- Reuse is consistent and intentional across APDs, project documents, and leadership and external communications

**Level 5 (Optimized)**

- Seamless reuse across systems and communications, which improves coherence and efficiency

---

### 5.2 Roles (Optional)

The Roles maturity criteria are optional for the states. These criteria are examples of the current qualities and practices that a SMA and its leaders possess or should consider adopting.

#### Technology Resources

**Level 1 (Initial)**

- Partial list of technical resources exists
- Capabilities are not fully understood across the SMA

**Level 2 (Developing)**

- SMA maintains a comprehensive list of all technical resources and their capabilities

**Level 3 (Defined)**

- SMA maps technical resources directly to business processes

**Level 4 (Managed)**

- Technical resources are actively shared and optimized across business units for seamless execution

**Level 5 (Optimized)**

- Technical resources are accessible to agencies, states, and federal partners and support continuous improvement through data-driven insights and collaborative efforts
- Drives technical reforms across the broader health and human services network

#### Organizational Goals Alignment

**Level 1 (Initial)**

- Business units operate in silos without clear understanding of enterprise-wide Medicaid goals

**Level 2 (Developing)**

- Organizational goals are defined but not fully communicated across all levels

**Level 3 (Defined)**

- Business units align their roles and processes to support broader Medicaid goals

**Level 4 (Managed)**

- All roles (internal and external) collaborate to drive enterprise-wide Medicaid program goals, with regular reassessments for alignment

**Level 5 (Optimized)**

- SMA leadership collaborates at the national level to set adaptable, data-driven goals and performance outcomes for the Medicaid program
- Focus is on improving healthcare and social services delivery and beneficiary well-being nationwide

#### Governance & Standardization

**Level 1 (Initial)**

- Limited or no formal governance to guide roles or standardize processes

**Level 2 (Developing)**

- Some governance exists, but role clarity and process standardization are inconsistent

**Level 3 (Defined)**

- Formal governance structures support role clarity, with standard operating procedures (SOP)

**Level 4 (Managed)**

- Enterprise governance bodies actively coordinate roles, processes, and data for continuous improvement and standardization

**Level 5 (Optimized)**

- SMA leads data-driven solutions at a national level and collaborates with other SMAs to develop shared business and technical standards that are disseminated nationally to strengthen overall Medicaid service delivery

#### Communication (Internal / External)

**Level 1 (Initial)**

- Minimal communication between leadership, business, and technical units

**Level 2 (Developing)**

- Defined communication channels exist but are not used consistently

**Level 3 (Defined)**

- Regular cross-unit communication occurs, including with external partners like Managed Care Organizations (MCO) and vendors

**Level 4 (Managed)**

- Transparent, enterprise-wide communication ensures all roles understand priorities, responsibilities, and impacts

**Level 5 (Optimized)**

- Integrates communication across all business areas to align long-term Medicaid goals and performance outcomes
- Fosters cooperation with other SMAs, CMS, and external partners nationally
- The Agency is recognized for its leadership in sharing solutions, provider enrollment process needs, and best practices

#### Culture & Leadership

**Level 1 (Initial)**

- Leadership lacks visibility into workloads and resource capacity
- Roles are reactive

**Level 2 (Developing)**

- Leadership begins assessing role capacity but lacks full enterprise insight

**Level 3 (Defined)**

- Leadership proactively manages workloads and roles based on enterprise needs and priorities

**Level 4 (Managed)**

- Leadership fosters a culture of collaboration and continuous learning across internal and external roles

**Level 5 (Optimized)**

- Leadership supports internal change agents to align culture, strategy, and resources with long-term Medicaid goals

#### Resourcing Capacity (Staffing, Training, Recruitment)

**Level 1 (Initial)**

- SMA struggles to identify gaps in role capacity
- Staffing is reactive

**Level 2 (Developing)**

- Some processes exist for role capacity management (staffing, training, recruitment)

**Level 3 (Defined)**

- SMA systematically identifies, recruits, and trains staff

**Level 4 (Managed)**

- SMA maintains a dynamic capacity model to forecast and meet enterprise role needs, including succession planning and continuous role development

**Level 5 (Optimized)**

- SMA uses comprehensive planning and advanced analytics to align roles and skills with program objectives, enabling rapid response to required changes while maintaining high service delivery standards

---

### 5.3 Business Architecture

#### Business Capability

**Level 1 (Initial)**

- The capability has been identified, and the use of the capability has been documented

**Level 2 (Developing)**

- The SMA has begun the documentation of the capability roles, supporting processes, technology, and information
- The capability complies with state and federal requirements

**Level 3 (Defined)**

- The SMA has fully documented and defined the capability roles, supporting processes, technology, and information
- The capability complies with state and federal requirements and conforms to MES industry-recognized architectural frameworks
- The capability is standardized and aligned at the enterprise level

**Level 4 (Managed)**

- The SMA manages the capability for performance and compliance
- The SMA monitors the metrics and measures of the capability

**Level 5 (Optimized)**

- The SMA uses performance monitoring to make improvements to the capability
- The SMA is a thought leader for the capability and shares capability information with other SMAs

#### Business Process

**Level 1 (Initial)**

- The business process(es) that support a capability have been identified and defined

**Level 2 (Developing)**

- The business process(es) that support a capability have been documented in SOPs with steps and roles responsible for each activity or decision

**Level 3 (Defined)**

- All associated staff members supporting the capability are following the same process steps in the same order for a standardized, repeatable approach to the work
- All processes are easily accessible in a Business Process Catalog

**Level 4 (Managed)**

- The business process(es) that support a capability have associated performance metrics (e.g., timeliness, quality, and efficiency) and are regularly tracked and reported to leadership to understand bottlenecks in the process
- A few business process steps are automated to streamline overall turnaround time without sacrificing quality

**Level 5 (Optimized)**

- The business process(es) that support a capability are regularly assessed using the performance metrics to identify process improvements to increase SMA effectiveness and efficiency
- All business process steps are automated as much as possible to streamline overall turnaround time without sacrificing quality

#### Business Process Model

**Level 1 (Initial)**

- Business process models are not fully developed for the supporting capability

**Level 2 (Developing)**

- Business Process Models are developed for all business processes supporting the capability and for staff reference

**Level 3 (Defined)**

- The business process model(s) that support a capability follow Business Process Modeling Notation (BPMN) 2.0 or other organization defined standard for business process documentation to ensure industry best practices are applied to the documentation

**Level 4 (Managed)**

- The business process model(s) that support a capability are developed in a standardized tool for version control and historical tracking of changes and their impact on metrics
- Business processes are managed in an enterprise catalog

**Level 5 (Optimized)**

- The business process model(s) are monitored and reviewed for improvement and updates for improvements

#### Role Management

**Level 1 (Initial)**

- The Role(s) that support the process are identified as part of the process documentation or process model

**Level 2-5**

- _(No additional criteria specified)_

#### Strategic Planning

**Level 1 (Initial)**

- The SMA's strategic plan is considered in the architectural and capability planning
- Aligned where possible

**Level 2 (Developing)**

- The SMA's strategic plan and capability planning are aligned through outcomes

**Level 3 (Defined)**

- The SMA's strategic plan has identified capabilities as a dependency to achieve outcomes
- Capabilities and processes are identified and analyzed as part enterprise risk and issue management
- Capabilities and processes are identified and analyzed as part of Enterprise Portfolio and Project Management

**Level 4 (Managed)**

- The SMA's Enterprise Roadmap (Projects / Initiatives) has identified capabilities and processes that support the roadmap items
- Capabilities and processes are identified and analyzed for intake of new business to support funding requests for an APD or for state funding for project approval

**Level 5 (Optimized)**

- Capabilities and processes are identified and analyzed in Enterprise Governance for decision-making

#### Enterprise Architecture

**Level 1 (Initial)**

- SMA recognizes the need for enterprise-wide planning and architectural frameworks
- Current Enterprise Architecture (EA) practices are unstructured, reactive, and inconsistent

**Level 2 (Developing)**

- SMA complies with federal guidance and has begun adopting MES-recognized EA frameworks
- EA processes exist but are not standardized or fully documented

**Level 3 (Defined)**

- SMA has fully implemented MES-recognized EA frameworks
- EA processes are standardized, documented, and aligned across business, information, and technology

**Level 4 (Managed)**

- SMA uses EA to monitor and manage MES performance
- EA is integrated into strategic planning and execution
- SMA collaborates with other SMAs to share EA practices

**Level 5 (Optimized)**

- SMA uses advanced, data-driven EA strategies for proactive decision-making
- EA drives enterprise optimization and continuous improvement
- SMA is nationally recognized for EA leadership

#### Policy Management

**Level 1 (Initial)**

- Policies relevant to business capabilities are informally identified or inconsistently documented
- There is little to no mapping of policies to business processes or systems

**Level 2 (Developing)**

- Some policies are documented, and the organization is starting to map policies to business processes and systems
- Compliance is mostly reactive
- Regular reviews are not established

**Level 3 (Defined)**

- All business policies relevant to the capability are identified, documented, and mapped to business processes and supporting systems
- Policies are harmonized with state and federal requirements, and their alignment is regularly reviewed to ensure compliance and support for enterprise objectives

**Level 4 (Managed)**

- Policy alignment is institutionalized and integrated into enterprise governance
- Policies are systematically reviewed, updated, and optimized based on performance data, regulatory changes, and strategic objectives

**Level 5 (Optimized)**

- Policy alignment is a proactive, continuous process that drives organizational agility, compliance, and innovation
- The organization demonstrates thought leadership and collaborates externally to share best practices

---

### 5.4 Information and Data

#### Data Storage & Warehousing

_Does the SMA manage the storage and warehousing of the information assets that support this capability?_

**Level 1 (Initial)**

- Storage locations for the information assets that support this capability have been identified and documented
- Basic storage and warehousing requirements for these information assets have been defined

**Level 2 (Developing)**

- Storage and warehousing procedures have been defined and documented
- Roles and responsibilities for managing the storage and warehousing of these information assets have been defined
- Storage and warehousing standards and conventions have been defined for the information assets

**Level 3 (Defined)**

- Storage and warehousing roles for this capability have been assigned to individuals, and they are actively performing their responsibilities
- Storage and warehousing standards and conventions have been adopted and are applied to the information assets that support this capability
- Storage and warehousing performance measures have been established for these information assets

**Level 4 (Managed)**

- Storage and warehousing performance and maturity assessments are conducted regularly for the information assets that support this capability
- Root cause analysis is performed and documented for issues affecting the storage or warehousing of the information assets

**Level 5 (Optimized)**

- Storage and warehousing improvement activities needed to increase performance and maturity are regularly identified and carried out for the information assets that support this capability

#### Data Architecture & Modeling

_Does the SMA manage the data architecture and models for the information assets that support this capability?_

**Level 1 (Initial)**

- The data architecture components needed to support this capability have been identified and documented
- Basic data modeling requirements for the information assets that support this capability have been defined

**Level 2 (Developing)**

- Data architecture and data modeling procedures for how each information asset is structured and represented have been defined and documented
- Roles and responsibilities for managing the data architecture and data models for these information assets have been defined
- Data architecture standards, modeling conventions, and reference structures needed to support these information assets have been defined

**Level 3 (Defined)**

- Data architecture and data modeling roles for this capability have been assigned to individuals, and those individuals are actively performing their responsibilities
- Data architecture standards, modeling conventions, and reference structures have been adopted and applied to the information assets that support this capability
- Data architecture and modeling performance measures have been established for these information assets

**Level 4 (Managed)**

- Data architecture and modeling performance assessments are conducted regularly for the information assets that support this capability
- Root cause analysis is performed and documented for issues affecting the data architecture or models of the information assets

**Level 5 (Optimized)**

- Data architecture and modeling improvement activities needed to increase performance and maturity are regularly identified and carried out for the information assets that support this capability

#### Document & Content Management

_Does the SMA manage the document and content information assets that support this capability?_

**Level 1 (Initial)**

- The document and content information assets needed to support this capability have been identified and documented
- Basic document and content management requirements for these information assets have been defined

**Level 2 (Developing)**

- Procedures for how each document and content asset is created, stored, updated, and archived have been defined and documented
- Roles and responsibilities for managing document and content information assets for this capability have been defined

**Level 3 (Defined)**

- Document and content management roles for this capability have been assigned to individuals, and those individuals are actively performing their responsibilities
- Document and content management standards, conventions, and retention rules have been adopted and applied to the information assets that support this capability
- Document and content management performance measures have been established for these information assets

**Level 4 (Managed)**

- Document and content management performance assessments and maturity assessments are conducted regularly for the information assets that support this capability
- Root cause analysis is performed and documented for issues affecting the document and content information assets

**Level 5 (Optimized)**

- Document and content management improvement activities needed to increase performance and maturity are regularly identified and carried out for the information assets that support this capability

#### Data Governance

_Does the SMA govern the information assets that support this capability?_

**Level 1 (Initial)**

- Information assets needed to support the capability have been identified and documented
- Data governance requirements for the information assets for this capability have been defined

**Level 2 (Developing)**

- Definition for how each information asset is used has been defined and documented
- Data governance roles and responsibilities needed to support the information assets for this capability have been defined
- Data policies, standards, reference models and specifications needed to support the information assets for this capability have been defined
- Data issues that impact the information assets for this capability have been defined and documented

**Level 3 (Defined)**

- Data governance roles needed to support this capability have been assigned to individuals and they are actively performing their assigned responsibilities
- Data governance information is stored centrally and accessible to key stakeholders that need access to it
- Data policies, standards, reference models, and specifications have been adopted and aligned to the information assets for this capability
- Data governance performance measures and standards have been established to support the information assets for this capability

**Level 4 (Managed)**

- Data governance performance assessments are performed regularly on the information assets for this capability
- Enterprise data governance capability maturity assessments are performed and aligned to the information assets for this capability
- Root cause analysis for the data issues that impact the information assets for the capability have been performed and documented

**Level 5 (Optimized)**

- Data governance activities needed to improve the performance and maturity of data governance of the information assets for this capability are regularly identified and performed

#### Data Privacy & Security

_Does the SMA manage the privacy and security of the information assets that support this capability?_

**Level 1 (Initial)**

- Privacy and security requirements for the information assets that support this capability have been identified and documented
- Basic protections (such as access restrictions or password controls) for these information assets have been defined

**Level 2 (Developing)**

- Procedures for how each information asset is protected, accessed, transmitted, and stored have been defined and documented
- Privacy and security roles and responsibilities for managing these information assets have been defined
- Privacy and security policies, standards, and controls (such as encryption requirements, data handling rules, and access control standards) have been defined

**Level 3 (Defined)**

- Privacy and security roles for this capability have been assigned to individuals, and those individuals are actively performing their responsibilities
- Privacy and security policies, standards, and controls have been adopted and applied to the information assets that support this capability
- Privacy and security performance measures have been established for these information assets

**Level 4 (Managed)**

- Privacy and security performance assessments and maturity assessments are performed regularly for the information assets that support this capability
- Root cause analysis is performed and documented for privacy and security incidents or issues affecting these information assets

**Level 5 (Optimized)**

- Privacy and security improvement activities needed to increase performance and maturity are regularly identified and carried out for the information assets that support this capability

#### Data Quality

_Does the SMA manage the quality of the information assets that support this capability?_

**Level 1 (Initial)**

- The data quality requirements for the information assets that support this capability have been identified and documented
- Basic expectations for accuracy, completeness, consistency, and timeliness have been defined

**Level 2 (Developing)**

- Procedures for how data quality is monitored, measured, and corrected for each information asset have been defined and documented
- Roles and responsibilities for managing data quality for these information assets have been defined
- Data quality standards, business rules, and validation requirements have been established

**Level 3 (Defined)**

- Data quality roles for this capability have been assigned to individuals, and those individuals are actively performing their responsibilities
- Data quality standards and business rules have been adopted and are consistently applied to the information assets that support this capability
- Data quality performance measures and thresholds have been established for these information assets

**Level 4 (Managed)**

- Data quality performance assessments and maturity assessments are regularly conducted for the information assets that support this capability
- Root cause analysis is performed and documented for data quality issues or defects affecting these information assets

**Level 5 (Optimized)**

- Data quality improvement activities needed to increase performance and maturity are regularly identified, prioritized, and carried out for the information assets that support this capability

#### Data Integration & Interoperability

_Does the SMA integrate the information assets that support this capability into the enterprise and maintain interoperability?_

**Level 1 (Initial)**

- Data exchanges needed for this capability have been identified

**Level 2 (Developing)**

- Structural / Transaction standards needed to support this capability have been defined and documented
- Mapping specifications needed to support the integration of each structure / transaction have been identified

**Level 3 (Defined)**

- Structure / Transaction data standards have been adopted and implemented
- Transaction data is actively received and integrated into the enterprise and is accessible to key stakeholders that need access to it
- Data integration & interoperability performance measures and standards have been established to support this capability

**Level 4 (Managed)**

- Data Integration & Interoperability performance assessments are performed regularly on the information assets for this capability
- Enterprise Data Integration & Interoperability capability maturity assessments are performed and aligned to the information assets for this capability

**Level 5 (Optimized)**

- The SMA continuously identifies and implements improvement initiatives aimed at enhancing integration performance and interoperability maturity
- Practices such as automation of data exchanges, adoption of emerging standards, and reuse of integration components are regularly pursued
- Progress and impact of improvement activities are measured through key performance indicators (KPI), and lessons learned are integrated into future initiatives to sustain growth in integration maturity

#### Master Data Management

_Does the SMA manage the master data that is needed to support this capability?_

**Level 1 (Initial)**

- Master data entities needed to support the capability have been identified
- Master data management requirement to support this capability have been defined

**Level 2 (Developing)**

- The data sources that impact the master data for this capability have been identified
- Master data rules / logic that support this capability have been defined and documented

**Level 3 (Defined)**

- Master data is accessible to the key stakeholders who need it to support this capability
- Master data performance measures and standards have been established to support this capability

**Level 4 (Managed)**

- Master data management performance assessments are performed regularly on the information assets for this capability
- Enterprise master data management capability maturity assessments are performed and aligned to the information assets for this capability

**Level 5 (Optimized)**

- Activities needed to improve the performance and maturity of master data management of the information assets for this capability are regularly identified and performed

#### Reference Data Management

_Does the SMA manage the reference data that is needed to support this capability?_

**Level 1 (Initial)**

- Reference data needed for this capability have been identified
- Reference data requirements for this capability have been defined

**Level 2 (Developing)**

- Reference data standards needed to support this capability have been defined and documented
- Crosswalks needed to support this capability have been identified

**Level 3 (Defined)**

- Crosswalks for the reference data needed to support this capability have been documented
- Reference data needed to support the capability is stored centrally and accessible to key stakeholders that need access to it
- Reference data performance measures and standards have been established to support this capability

**Level 4 (Managed)**

- Regular assessments of reference data quality and management practices are conducted, including audits and validation activities to identify gaps and improvement opportunities
- Root cause analyses are performed and documented for issues impacting reference data, with corrective actions implemented
- Monitoring tools, audit logs, and reporting mechanisms are maintained to ensure ongoing compliance and quality

**Level 5 (Optimized)**

- The SMA continuously identifies and executes improvement activities aimed at enhancing reference data quality, consistency, and management maturity
- Practices such as automation, standardization, and integration of reference data processes are adopted to increase efficiency
- The organization actively participates in or contributes to industry standards and best practices for reference data management
- The impact of improvement initiatives is measured through KPIs, and lessons learned are incorporated to sustain ongoing maturation of reference data management capabilities

#### Business Intelligence

_Does the SMA provide business intelligence (BI) to support his capability?_

**Level 1 (Initial)**

- Measures and Reports needed for this capability have been identified
- Business Intelligence requirements for this capability have been defined

**Level 2 (Developing)**

- Measure and report specifications needed for this capability have been defined and documented
- Reports needed for this capability can be traced to the specific data elements that are used in the report

**Level 3 (Defined)**

- Measures and Reports needed for this capability are stored centrally and accessible to key stakeholders that need access to it
- Business Intelligence performance measures and standards have been established to support this capability

**Level 4 (Managed)**

- Regular assessments of BI performance and data quality are conducted, including validation, user feedback, and usage analysis
- Root cause analysis is performed for issues such as incorrect reports or data discrepancies, with corrective actions documented and tracked
- Monitoring dashboards and audit logs are maintained to oversee BI system performance, security, and compliance

**Level 5 (Optimized)**

- The SMA continuously identifies and implements improvement activities to enhance BI capabilities, data quality, and user experience
- Practices such as automation, advanced analytics, and self-service BI are adopted to increase agility and insight generation
- The organization actively explores new BI technologies, data visualization techniques, and analytics methods to increase maturity
- The impact of BI improvements is measured through KPIs such as decision-making speed, data accuracy, and stakeholder satisfaction, with lessons learned incorporated into ongoing initiatives

#### Metadata Management

_Does the SMA manage the metadata for the information assets that support this capability?_

**Level 1 (Initial)**

- Metadata requirements for the information assets for this capability have been defined

**Level 2 (Developing)**

- Metadata standards and expectations have been defined for the metadata needed to manage the information assets for the capability
- Metadata about the information assets for this capability have been identified and documented

**Level 3 (Defined)**

- Metadata about the information assets for this capability are stored centrally and accessible to key stakeholders that need access to it
- Metadata performance measures and standards have been established to support this capability

**Level 4 (Managed)**

- Metadata management performance assessments are performed regularly on the information assets for this capability
- Enterprise metadata management capability maturity assessments are performed and aligned to the information assets for this capability

**Level 5 (Optimized)**

- Activities needed to improve the performance and maturity of metadata management of the information assets for this capability are regularly identified and performed

---

## 5.5 Technology

The Technology dimension includes seven sub-dimensions:

1. Infrastructure
2. Integration
3. Platform Services
4. Application Architecture
5. Security and Identity
6. Operations and Maintenance
7. Development and Release

### Technology Architecture Overview

The following provides high-level definitions for each maturity level as it applies to the overall Technical Architecture:

**Level 1 (Initial)**

- The State operates a monolithic, legacy MMIS with little modernization or capability to interact with other systems as evidenced by limited modularity, reuse, or interoperability
- Integrations occur through direct connections, using proprietary formats and batch file transfers
- Security practices are fragmented; compliance processes are manual with limited automation

**Level 2 (Developing)**

- The State has begun modularizing core Medicaid functions (e.g., eligibility and claims) and piloting standards-based application programming interfaces (API) (e.g., National Information Exchange Model [NIEM] and Health Level 7 [HL7])
- Non-critical modules are piloted in Software as a Service (SaaS) environments; security policies exist but lack centralized enforcement
- Security policies are in place, but enforcement remains siloed
- The state is implementing modular components and piloting cloud solutions and standards, but it lacks overall enterprise integration

**Level 3 (Defined)**

- Core Medicaid systems are modularized with standardized service contracts and interoperable APIs aligned with CMS and national standards (e.g., Fast Healthcare Interoperability Resources [FHIR], HL7, and X12)
- A hybrid cloud model supports scalability and modernization, with a cloud-first policy for new modules
- State runs a modular, standards-based Medicaid enterprise that aligns with CMS's requirements for modularity and interoperability

**Level 4 (Managed)**

- The Medicaid Enterprise is governed as a cohesive platform with real-time interoperability across modules, MCOs, Health Information Exchanges (HIE), and CMS
- Performance metrics are actively monitored and used for continuous improvement
- Most of the Medicaid Enterprise is hosted in the cloud and designed for flexibility and reliability
- States manage the Medicaid Enterprise as a cloud-based platform

**Level 5 (Optimized)**

- The enterprise is fully composable, enabling dynamic orchestration of services and seamless integration with broader human services (e.g., Supplemental Nutrition Assistance Program [SNAP], Transitional Assistance for Needy Families [TANF], and behavioral health)
- The Medicaid Enterprise is cloud-native and serverless, ensuring resilience and scalability across the nation
- A zero-trust architecture is fully implemented; compliance is continuous and automated
- The state manages a next-generation, adaptive Medicaid enterprise

---

### 5.5.1 Infrastructure

#### Overview

**Level 1 (Initial)**

- The infrastructure is legacy bound, primarily on-premises, with minimal virtualization or automation
- Networking is flat and insecure, storage is unmanaged, and resilience is reactive
- There is no formal governance, monitoring, or scaling capability

**Level 2 (Developing)**

- The state begins adopting virtualization and piloting cloud services for non-critical workloads
- Basic security and backup policies are introduced
- Networking is segmented, and Disaster Recovery (DR) plans exist but are untested
- Governance roles are emerging, but practices are inconsistent

**Level 3 (Defined)**

- A hybrid cloud model is in place with standardized provisioning and container adoption
- Storage is tiered and policy driven
- Secure, segmented networking supports external partners
- DR is tested, and auto-scaling is implemented for some workloads
- Technical debt is tracked, and observability is established

**Level 4 (Managed)**

- The infrastructure is governed by a cloud-first policy, with container orchestration, Infrastructure-as-Code (IaC), and integrated monitoring
- Storage and networking are optimized for performance, cost, and compliance
- DR and scaling are automated and aligned with business KPIs
- Zero-trust principles are emerging

**Level 5 (Optimized)**

- The infrastructure is fully cloud native, composable, and adaptive
- Serverless and edge computing are used where appropriate
- Artificial Intelligence (AI) / Machine Learning (ML) supports predictive scaling, anomaly detection, and self-healing
- Zero-trust networking and continuous compliance are fully implemented
- Governance is dynamic and data driven

#### Compute and Hosting

**Level 1 (Initial)**

- All workloads run on legacy on-premises servers
- No virtualization or cloud usage
- No centralized inventory of compute assets

**Level 2 (Developing)**

- Some virtualization is introduced
- Cloud pilots are used for non-critical workloads
- Compute provisioning is manual and ad hoc

**Level 3 (Defined)**

- A hybrid cloud model is adopted
- Virtual machines (VM) and containers are provisioned using standardized templates
- Compute assets are inventoried and monitored

**Level 4 (Managed)**

- Cloud-first policy is enforced
- Container orchestration (e.g., Kubernetes) and IaC are used for provisioning
- Compute resources are monitored for performance and cost

**Level 5 (Optimized)**

- Fully cloud-native and serverless where appropriate
- Compute provisioning is dynamic and policy driven
- AI/ML supports predictive scaling and self-healing

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are most workloads hosted on physical servers? (Yes/No)
- Q: Is there a centralized inventory of compute assets? (Yes/No)
- E: Server inventory spreadsheet
- E: Screenshots of legacy on-premise systems

_Level 2:_

- Q: Are non-critical workloads piloted in the cloud? (Yes/No)
- Q: Are virtualization tools in use? (Yes/No)
- E: Cloud pilot documentation
- E: Virtualization deployment plan

_Level 3:_

- Q: Is there a hybrid cloud model in place? (Yes/No)
- Q: Are provisioning processes standardized? (Yes/No)
- E: Hybrid cloud architecture diagram
- E: VM provisioning templates

_Level 4:_

- Q: Is IaC integrated into Continuous Integration (CI) / Continuous Delivery (CD) pipelines? (Yes/No)
- Q: Are containers orchestrated using a platform like Kubernetes? (Yes/No)
- E: IaC scripts in version control
- E: Deployment manifests

_Level 5:_

- Q: Are compute resources dynamically provisioned based on usage? (Yes/No)
- Q: Is serverless computing used in production? (Yes/No)
- E: Serverless architecture diagrams
- E: Scaling dashboards using AI/ML

#### Storage

**Level 1 (Initial)**

- Local storage only
- Manual backups
- No encryption or retention policies
- Storage growth is unmanaged

**Level 2 (Developing)**

- Basic Storage Area Network (SAN) / Network Attached Storage (NAS) is introduced
- Some automated backups
- Retention policies are drafted but not enforced

**Level 3 (Defined)**

- Tiered storage is implemented
- Cloud backups and encryption are enforced
- Immutable backups are used for critical data

**Level 4 (Managed)**

- Storage lifecycle is automated
- Cost optimization and anomaly detection are in place
- Storage is aligned with data classification policies

**Level 5 (Optimized)**

- AI/ML-driven tiering and self-healing storage
- Continuous compliance with Health Insurance Portability and Accountability Act (HIPAA), National Institute of Standards and Technology (NIST), and state policies
- Storage adapts to usage and risk patterns

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are backups performed manually? (Yes/No)
- Q: Are storage growth and retention unmanaged? (Yes/No)
- E: Backup logs (manual)
- E: Storage device inventory

_Level 2:_

- Q: Are retention policies defined but not enforced? (Yes/No)
- Q: Are backups partially automated? (Yes/No)
- E: Draft retention policy
- E: SAN/NAS configuration screenshots

_Level 3:_

- Q: Is encryption enforced for data at rest and in transit? (Yes/No)
- Q: Are immutable backups used? (Yes/No)
- E: Tiered storage policy
- E: Cloud backup configuration

_Level 4:_

- Q: Is storage lifecycle automated based on policy? (Yes/No)
- Q: Are anomalies in storage usage detected automatically? (Yes/No)
- E: Storage lifecycle automation scripts
- E: Cost optimization reports

_Level 5:_

- Q: Is storage self-healing and AI-optimized? (Yes/No)
- Q: Is compliance continuously validated? (Yes/No)
- E: Tiering engine logs
- E: Compliance audit reports (HIPAA, NIST)

#### Networking and Connectivity

**Level 1 (Initial)**

- Flat network with no segmentation
- No secure external access
- No formal documentation or monitoring

**Level 2 (Developing)**

- Virtual Private Networks (VPN) and firewalls are introduced
- Some secure partner access
- Basic network monitoring is in place

**Level 3 (Defined)**

- Network is segmented using Virtual Local Area Networks (VLAN) or security zones
- Redundant connectivity is established
- Real-time dashboards monitor traffic

**Level 4 (Managed)**

- Software-Defined Wide Area Network (SD-WAN) or cloud-native networking is adopted
- Zero-trust principles are emerging
- Network traffic is monitored and alerts are automated

**Level 5 (Optimized)**

- Fully zero-trust architecture
- Dynamic routing and posture assessment
- AI-driven analytics continuously optimize network performance and security

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Is the network flat and unsegmented? (Yes/No)
- Q: Is there secure external access? (Yes/No)
- E: Network topology diagram (flat)

_Level 2:_

- Q: Are VPNs and firewalls in place? (Yes/No)
- Q: Is partner access manually provisioned? (Yes/No)
- E: Network topology diagram
- E: Partner access documentation

_Level 3:_

- Q: Is network segmentation enforced? (Yes/No)
- Q: Are dashboards used to monitor traffic? (Yes/No)
- E: VLAN / security zone documentation
- E: Real-time network dashboards / screenshots

_Level 4:_

- Q: Is zero-trust architecture emerging? (Yes/No)
- Q: Is network traffic monitored in real time? (Yes/No)
- E: SD-WAN Deployment Plan
- E: Zero-trust documentation

_Level 5:_

- Q: Is network posture continuously assessed and adjusted? (Yes/No)
- Q: Is dynamic routing implemented? (Yes/No)
- E: Network analytics
- E: Dynamic routing documentation

#### Resilience and Scaling

**Level 1 (Initial)**

- No DR plan
- Failover is manual
- No scaling capabilities
- Outages are handled reactively

**Level 2 (Developing)**

- DR plan exists but is untested
- Manual load balancing is used
- Basic scripts support limited scaling

**Level 3 (Defined)**

- DR is tested annually
- Auto-scaling is implemented for some workloads
- Resilience metrics (e.g., Recovery Time Objective [RTO] / Recovery Point Objective [RPO]) are tracked

**Level 4 (Managed)**

- DR is automated and tested regularly
- Elastic scaling is tied to business KPIs
- Resilience is monitored in real time

**Level 5 (Optimized)**

- Predictive resilience using telemetry and AI
- Seamless DR with no user impact
- Scaling is adaptive and policy driven

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Is there a documented DR plan? (Yes/No)
- Q: Are failovers handled manually? (Yes/No)
- E: DR Plan (if any)
- E: Failover logs

_Level 2:_

- Q: Are DR plans tested regularly? (Yes/No)
- Q: Is load balancing manual or scripted? (Yes/No)
- E: Load balancing documentation
- E: DR test schedule (Draft)

_Level 3:_

- Q: Are resilience metrics tracked? (Yes/No)
- Q: Is auto-scaling implemented for some workloads? (Yes/No)
- E: Auto-scaling configuration
- E: RTO / RPO metrics

_Level 4:_

- Q: Is DR automated and aligned with KPIs? (Yes/No)
- Q: Is scaling tied to real-time demand? (Yes/No)
- E: Elastic scaling policy
- E: DR automation documentation

_Level 5:_

- Q: Is resilience predictive and AI-driven? (Yes/No)
- Q: Are outages mitigated before they occur? (Yes/No)
- E: Analytics Dashboard
- E: Failure mitigation documentation

---

### 5.5.2 Integration

#### Overview

**Level 1 (Initial)**

- The interfaces are single purpose with minimal use of data standards and no documentation
- There is little to no oversight
- System messages are not exchanged or consolidated
- Partner integrations are lacking consistency

**Level 2 (Developing)**

- Interface patterns and data standards are developed for reuse
- New and updated interfaces are subject to oversight and require documentation
- Systems exchange some messages, but exchanges lack standards
- Partner integration patterns are under development

**Level 3 (Defined)**

- New interface designs are based on reuse and data standards
- Governance and documentation standards are in place
- Patterns for exchanging messages between systems are in place
- External partner integration follows standard processes and design

**Level 4 (Managed)**

- Software frameworks are widely used and there is extensive interface reuse
- Data standards are applied to interfaces and interface specifications are published
- Messages for critical information are exchanged across systems using standard patterns and tools
- Eliminating variation of partner integration and automating endpoint management

**Level 5 (Optimized)**

- Single use interfaces are eliminated
- Interfaces follow patterns and implement data standards
- Specifications are published using API management tools
- Systems exchange messages using tools that trigger alerts when needed and track problems through to resolution
- Partner integration is standardized, and endpoints are continually monitored

#### API and Interface Management

**Level 1 (Initial)**

- Interfaces are point-to-point, single purpose, and inconsistently designed
- Data standards are rarely applied
- No governance or documentation exists

**Level 2 (Developing)**

- Interface patterns and data standards are defined
- Some reuse is piloted
- Documentation and oversight are introduced for new interfaces

**Level 3 (Defined)**

- New interfaces follow defined patterns and apply data standards (e.g., FHIR and X12)
- Governance and documentation standards are enforced

**Level 4 (Managed)**

- Interfaces are widely reused
- API specifications are published using API management tools
- Governance drives standardization and lifecycle management

**Level 5 (Optimized)**

- All interfaces follow standardized patterns and data standards
- API specifications are discoverable and versioned
- Interface behavior is monitored and dynamically adjusted based on usage and policy

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are interfaces primarily point-to-point and single purpose? (Yes/No)
- Q: Is interface documentation available? (Yes/No)
- E: Interface inventory (if any)
- E: Screenshots of point-to-point connections

_Level 2:_

- Q: Are interface patterns defined? (Yes/No)
- Q: Are new interfaces subject to review or documentation? (Yes/No)
- E: Draft interface patterns
- E: Sample API specifications using emerging standards
- E: Governance meeting notes

_Level 3:_

- Q: Are APIs designed using standardized patterns? (Yes/No)
- Q: Are APIs versioned and documented? (Yes/No)
- Q: Is interface governance enforced? (Yes/No)
- E: API design templates
- E: Interface governance policy
- E: Versioned API documentation

_Level 4:_

- Q: Are APIs published and discoverable via a management platform? (Yes/No)
- Q: Is interface reuse tracked and governed? (Yes/No)
- Q: Are APIs monitored for usage and performance? (Yes/No)
- E: API management platform screenshots
- E: Usage analytics reports
- E: Interface lifecycle documentation

_Level 5:_

- Q: Are all interfaces standardized and reusable? (Yes/No)
- Q: Are APIs dynamically adjusted based on usage or policy? (Yes/No)
- Q: Is interface behavior monitored and optimized in real time? (Yes/No)
- E: Dynamic API gateway configuration
- E: Real-time interface health dashboards
- E: Policy-driven API orchestration logs

#### System Messaging

**Level 1 (Initial)**

- No messaging between systems
- Data is exchanged manually or via batch files

**Level 2 (Developing)**

- Some messaging is introduced using non-standard formats
- Alerts are manually triggered

**Level 3 (Defined)**

- Messaging patterns are standardized
- Messages trigger alerts and are logged
- Messaging is used for key business events

**Level 4 (Managed)**

- Messaging is used for real-time, critical information exchange
- Alerts are traceable and integrated with monitoring tools

**Level 5 (Optimized)**

- Messaging is event-driven and proactive
- Messages trigger automated workflows and predictive alerts
- Messaging patterns are reused across the enterprise

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Is there any real-time messaging between systems? (Yes/No)
- Q: Are alerts triggered manually? (Yes/No)
- E: Messaging pilot documentation
- E: Batch file transfer logs
- E: Manual alerting procedures

_Level 2:_

- Q: Are messaging patterns defined? (Yes/No)
- Q: Are some messages exchanged between systems? (Yes/No)
- Q: Are alerts traceable? (Yes/No)
- E: Messaging pilot documentation
- E: Sample message formats
- E: Alert logs

_Level 3:_

- Q: Are messages exchanged using standard formats? (Yes/No)
- Q: Do messages trigger automated alerts? (Yes/No)
- E: Messaging architecture diagrams
- E: Message schemas (e.g., HL7 and FHIR)
- E: Alert correlation rules

_Level 4:_

- Q: Are critical messages exchanged in real time? (Yes/No)
- Q: Are alerts integrated with monitoring tools? (Yes/No)
- Q: Are messaging SLAs tracked? (Yes/No)
- Q: Are messaging patterns reused across systems? (Yes/No)
- E: Real-time alert dashboards
- E: Messaging middleware configuration
- E: Service Level Agreement (SLA) monitoring reports

_Level 5:_

- Q: Are messages used to proactively address issues? (Yes/No)
- Q: Are alerts predictive and self-resolving? (Yes/No)
- Q: Is messaging fully event-driven? (Yes/No)
- E: Real-time alert dashboards
- E: Event-driven architecture documentation
- E: Predictive alerting dashboards
- E: Automated remediation logs

#### External Partner Integration

**Level 1 (Initial)**

- Partner integrations are ad hoc
- No standards or endpoint management practices exist

**Level 2 (Developing)**

- Integration patterns and endpoint management processes are defined
- Some partners follow emerging standards

**Level 3 (Defined)**

- New integrations follow standard patterns
- Endpoints are registered and managed
- Security and data-sharing agreements are documented

**Level 4 (Managed)**

- Most partner integrations use standardized patterns
- Endpoint management is automated
- Integration health is monitored

**Level 5 (Optimized)**

- Partner integrations are consolidated and governed through shared services
- Endpoint management is integrated with Information Technology Service Management (ITSM)
- Real-time monitoring and automated remediation are in place

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are partner integrations standardized? (Yes/No)
- Q: Are integration endpoints managed centrally? (Yes/No)
- E: Ad hoc partner connection logs
- E: Lack of endpoint registry
- E: Manual onboarding procedures

_Level 2:_

- Q: Are integration patterns defined for partners? (Yes/No)
- Q: Are endpoint management processes emerging? (Yes/No)
- E: Draft partner integration patterns
- E: Endpoint inventory spreadsheet
- E: Sample onboarding checklist

_Level 3:_

- Q: Are new partner integrations following standard patterns? (Yes/No)
- Q: Are endpoints registered and governed? (Yes/No)
- Q: Are partner agreements documented? (Yes/No)
- E: Partner integration playbook
- E: Endpoint registration forms
- E: Security and data-sharing agreements

_Level 4:_

- Q: Are most partner integrations standardized and monitored? (Yes/No)
- Q: Is endpoint management automated? (Yes/No)
- Q: Are integration SLAs enforced? (Yes/No)
- E: Automated endpoint management tool
- E: Partner integration dashboards
- E: SLA compliance reports

_Level 5:_

- Q: Are partner integrations consolidated and reusable? (Yes/No)
- Q: Is endpoint management integrated with ITSM? (Yes/No)
- Q: Are partner connections monitored in real time? (Yes/No)
- E: Shared services integration catalog
- E: Real-time partner health dashboards
- E: ITSM integration logs

---

### 5.5.3 Platform Services

#### Overview

**Level 1 (Initial)**

- Applications are hosted in environments lacking platform standards or strategy
- Hosting uses dedicated servers or virtual machines with limited scaling capability
- There is very little automation of platform services
- Commonly used services such as document management workflow, rules management, and address validation, are deployed independently when they are needed

**Level 2 (Developing)**

- Applications are hosted in environments using standards for platform capabilities
- Hosting primarily uses virtual servers
- The platform supports use of APIs and integration with Commercial Off-The-Shelf (COTS) tools and Software as a Service (SaaS) services
- Business rules and workflow capabilities are restricted to limited business functions
- Common services are used for a single module within a single vendor or state environment

**Level 3 (Defined)**

- Platforms include Platform as a Service (PaaS) services such as databases, application containers, API security, and network integration
- The platform uses SaaS and leveraged COTS tools for business capabilities such as workflow, rules-based processing, and document management
- Common services are leveraged across modules but within the domain of a single vendor or state environment

**Level 4 (Managed)**

- PaaS services are the primary hosting platform
- The platforms are designed and implemented using standards to limit complexity and to support automation
- Commonly used business and technical capabilities are implemented using SaaS and COTS tools
- Some tools are available across vendor and state hosting environments using APIs

**Level 5 (Optimized)**

- Platforms are based almost exclusively on PaaS services
- Platform standards include integration with operations management
- APIs are used to manage hosting including automated scaling
- Most services used across modules and environments are available from a common source although modules may use their own capabilities

#### Application Hosting

**Level 1 (Initial)**

- Applications are hosted on dedicated physical or virtual servers
- No platform standards
- Limited scalability and automation

**Level 2 (Developing)**

- Hosting environments use virtual servers with some standardization
- SaaS and COTS tools are piloted
- APIs are used for limited integration

**Level 3 (Defined)**

- Hosting platforms include PaaS services (e.g., databases, containers, and identity)
- SaaS and COTS tools are integrated for business capabilities

**Level 4 (Managed)**

- PaaS or SaaS is the primary hosting model
- Platforms are designed using standards to support automation, scalability, and cross-vendor integration

**Level 5 (Optimized)**

- Hosting is cloud native and policy driven
- APIs manage deployment, scaling, and monitoring
- Platforms are integrated with operations and support multi-tenant, cross-state reuse

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are applications hosted on dedicated servers? (Yes/No)
- Q: Is there a platform strategy? (Yes/No)
- E: Server inventory
- E: Unmanaged hosting screenshots

_Level 2:_

- Q: Are virtual servers used consistently? (Yes/No)
- Q: Are SaaS tools piloted? (Yes/No)
- E: Virtual server deployment plan
- E: SaaS pilot documentation

_Level 3:_

- Q: Are PaaS services used for hosting? (Yes/No)
- Q: Are APIs integrated with hosting platforms? (Yes/No)
- E: PaaS architecture diagrams
- E: Container usage logs

_Level 4:_

- Q: Are platforms designed for automation and reuse? (Yes/No)
- Q: Is cross-vendor integration supported? (Yes/No)
- E: Platform standards
- E: Cross-vendor integration documentation

_Level 5:_

- Q: Are platforms cloud native and policy driven? (Yes/No)
- Q: Are services reused across states/vendors? (Yes/No)
- E: API-driven deployment scripts
- E: Multi-tenant hosting logs

#### Business Rules and Workflow

**Level 1 (Initial)**

- Business rules and workflows are hardcoded within applications
- No reuse or externalization

**Level 2 (Developing)**

- Rules and workflows are coded but follow emerging standards
- Some COTS tools for specific functions

**Level 3 (Defined)**

- COTS or SaaS tools are used to manage rules and workflows
- Reuse is limited to specific modules or vendors

**Level 4 (Managed)**

- Rules and workflows are externalized and reused across modules
- Tools support versioning, testing, and governance

**Level 5 (Optimized)**

- Rules and workflows are dynamically orchestrated across systems
- Business users can configure logic
- AI/ML supports optimization and exception handling

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are rules/workflows hard coded? (Yes/No)
- Q: Is there any reuse? (Yes/No)
- E: Application code with embedded rules
- E: Lack of external tools

_Level 2:_

- Q: Are rules coded but follow standards? (Yes/No)
- Q: Are COTS tools used for specific functions? (Yes/No)
- E: COTS tool pilot reports
- E: Rule documentation

_Level 3:_

- Q: Are rules/workflows externalized? (Yes/No)
- Q: Are they reused across modules? (Yes/No)
- E: SaaS rule engine screenshots
- E: Workflow configuration files

_Level 4:_

- Q: Are rules versioned and governed? (Yes/No)
- Q: Are they reused across vendors? (Yes/No)
- E: Rule governance policy
- E: Versioning logs

_Level 5:_

- Q: Can business users configure rules? (Yes/No)
- Q: Are rules dynamically orchestrated? (Yes/No)
- E: AI-optimized rule engine logs
- E: Business user configuration UI

#### Common Platform Functions

**Level 1 (Initial)**

- Common services are developed independently within each module
- No reuse or standardization

**Level 2 (Developing)**

- Some services (e.g., document upload and address validation) are reused within a single module or vendor environment

**Level 3 (Defined)**

- Shared services are available across multiple modules
- APIs and documentation support reuse

**Level 4 (Managed)**

- Common services are standardized, governed, and integrated with platform operations
- Usage is monitored and optimized

**Level 5 (Optimized)**

- Services are composable, discoverable, and reused across states and vendors
- Service catalogs and self-service provisioning are available

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are services developed independently by module? (Yes/No)
- Q: Is there any reuse? (Yes/No)
- E: Module-specific services (e.g., file upload)
- E: No shared catalog

_Level 2:_

- Q: Are services reused within a module or vendor? (Yes/No)
- Q: Is reuse documented? (Yes/No)
- E: Internal service registry
- E: Single-module reuse examples

_Level 3:_

- Q: Are services reused across multiple modules? (Yes/No)
- Q: Are APIs documented and discoverable? (Yes/No)
- E: API documentation for shared services
- E: Usage logs

_Level 4:_

- Q: Are services standardized and monitored? (Yes/No)
- Q: Is usage tracked across modules? (Yes/No)
- E: Service governance policy
- E: Monitoring dashboards

_Level 5:_

- Q: Are services composable and reused across states/vendors? (Yes/No)
- Q: Is provisioning self-service? (Yes/No)
- E: Service catalog
- E: Self-service provisioning portal

---

### 5.5.4 Application Architecture

#### Overview

**Level 1 (Initial)**

- Medicaid systems are monolithic and tightly coupled, with limited ability to scale, replace, or integrate components
- User interfaces are inconsistent and inaccessible, and session management is unreliable or nonexistent
- There is no architectural governance or reuse

**Level 2 (Developing)**

- Some modules or services are isolated and piloted, but integration and reuse are limited
- User interfaces begin to adopt responsive design and accessibility guidelines
- Session handling is basic and inconsistent across systems
- Architecture decisions are ad hoc

**Level 3 (Defined)**

- Systems are modularized with standardized APIs and service contracts
- UI components are consistent and accessible, and session state is maintained across modules
- Architecture is documented and aligned with CMS interoperability standards

**Level 4 (Managed)**

- Modular architecture is governed and reused across the enterprise
- Interfaces are mobile-first, role-based, and tested for accessibility
- Session and state are centrally managed and secure
- Architecture supports scalability, monitoring, and DevOps integration

**Level 5 (Optimized)**

- The architecture is fully composable, adaptive, and event driven
- Interfaces are personalized and continuously improved using analytics
- Session and state management is intelligent, context-aware, and resilient across devices and channels
- Architecture enables rapid innovation and seamless integration with external systems

#### Modular Architecture

**Level 1 (Initial)**

- Applications are monolithic and tightly coupled
- Changes require full redeployment
- No service boundaries or reuse

**Level 2 (Developing)**

- Some components are isolated or piloted as services
- Modularization is informal
- No formal service contracts or governance

**Level 3 (Defined)**

- Core systems are decomposed into modules with standardized APIs and service contracts
- Modules can be deployed independently

**Level 4 (Managed)**

- Modular architecture is governed by patterns and standards
- Shared services are reused across modules
- Modules are independently scalable and monitored

**Level 5 (Optimized)**

- Architecture is fully composable and event driven
- Modules are dynamically orchestrated and integrate seamlessly with external systems
- Architecture supports rapid innovation and plug-and-play capabilities

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are applications monolithic and tightly coupled? (Yes/No)
- Q: Is modularity absent? (Yes/No)
- E: Legacy system diagrams
- E: Full redeployment logs

_Level 2:_

- Q: Are some components isolated or piloted as services? (Yes/No)
- Q: Are service boundaries informal? (Yes/No)
- E: Pilot service documentation
- E: Partial modularization notes

_Level 3:_

- Q: Are modules deployed independently with standardized APIs? (Yes/No)
- Q: Are service contracts defined? (Yes/No)
- E: API specifications
- E: Service contract templates
- E: Modular architecture diagrams

_Level 4:_

- Q: Are modular patterns governed and reused? (Yes/No)
- Q: Are modules independently scalable and monitored? (Yes/No)
- E: Architecture governance policy
- E: Monitoring dashboards

_Level 5:_

- Q: Is the architecture fully composable and event driven? (Yes/No)
- Q: Are services dynamically orchestrated? (Yes/No)
- E: Event-driven architecture diagrams
- E: Orchestration engine logs

#### User Interfaces

**Level 1 (Initial)**

- Interfaces are static and form based
- Design is inconsistent
- No accessibility compliance

**Level 2 (Developing)**

- Some interfaces are redesigned for responsiveness
- Accessibility guidelines are drafted
- Basic usability testing is conducted

**Level 3 (Defined)**

- Standardized UI components are used
- Interfaces comply with Web Content Accessibility Guidelines (WCAG) 2.1 AA
- User feedback loops are established

**Level 4 (Managed)**

- Design systems are reused across teams
- Interfaces are mobile first and role based
- Accessibility is tested automatically

**Level 5 (Optimized)**

- Interfaces are adaptive and personalized
- AI/ML supports User Experience (UX) optimization
- Continuous improvement is driven by analytics and user behavior

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are interfaces static and inconsistent? (Yes/No)
- Q: Is accessibility unsupported? (Yes/No)
- E: Screenshots of legacy UIs
- E: Lack of WCAG documentation

_Level 2:_

- Q: Are some interfaces responsive or redesigned? (Yes/No)
- Q: Are accessibility guidelines drafted? (Yes/No)
- E: Draft UI standards
- E: Usability test results

_Level 3:_

- Q: Are standardized UI components used? (Yes/No)
- Q: Is WCAG 2.1 AA compliance achieved? (Yes/No)
- E: UI component library
- E: Accessibility audit reports

_Level 4:_

- Q: Are design systems reused across teams? (Yes/No)
- Q: Are interfaces mobile first and role based? (Yes/No)
- E: Design system documentation
- E: Automated accessibility test logs

_Level 5:_

- Q: Are interfaces adaptive and personalized? (Yes/No)
- Q: Is UX continuously optimized using analytics? (Yes/No)
- E: UX analytics dashboards
- E: AI-driven personalization logs

#### Session and State Management

**Level 1 (Initial)**

- No session persistence
- Users lose progress on timeout
- No support for multi-tab or multi-device continuity

**Level 2 (Developing)**

- Basic session timeout and login persistence
- Draft saving is available in some modules
- Session handling is inconsistent

**Level 3 (Defined)**

- Session state is maintained across modules
- Drafts are recoverable
- Session expiration is policy driven

**Level 4 (Managed)**

- Centralized session and state management are implemented
- Multi-device continuity is supported
- Session data is encrypted and monitored

**Level 5 (Optimized)**

- Session state is preserved across devices and sessions
- Context-aware restoration is enabled
- Session behavior adapts to user patterns and risk signals

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Is session persistence absent? (Yes/No)
- Q: Do users lose progress on timeout? (Yes/No)
- E: Session timeout logs
- E: Lack of session recovery features

_Level 2:_

- Q: Is basic session handling implemented? (Yes/No)
- Q: Are drafts saved in some modules? (Yes/No)
- E: Draft-saving feature screenshots
- E: Session timeout settings

_Level 3:_

- Q: Is session state maintained across modules? (Yes/No)
- Q: Are expiration policies defined? (Yes/No)
- E: Session management policy
- E: Cross-module session logs

_Level 4:_

- Q: Is session/state management centralized? (Yes/No)
- Q: Is multi-device continuity supported? (Yes/No)
- E: Session encryption logs
- E: Centralized session service documentation

_Level 5:_

- Q: Is session behavior context-aware and adaptive? (Yes/No)
- Q: Is session state preserved across devices and sessions? (Yes/No)
- E: AI-driven session management logs
- E: Cross-device continuity test results

---

### 5.5.5 Security and Identity

#### Overview

**Level 1 (Initial)**

- Security controls are dispersed without oversight
- Multiple identity management systems may be in place
- Minimal capabilities to manage and use member consent
- Lack of visibility to security protections across the enterprise
- Limited and siloed monitoring

**Level 2 (Developing)**

- Some consolidation of identity management systems
- Member consent management is in place
- Consent management is in place, but some processes such as revoking consent are manual
- Standards exist for security protection and monitoring, but are not fully implemented

**Level 3 (Defined)**

- Some applications use standalone identity management systems
- Consent management in place
- Security protections are defined and implemented for most systems
- Security Information and Event Management (SIEM) tool used on most systems

**Level 4 (Managed)**

- Single identity management system used by all applications
- Consent management is in place
- Security controls are standardized, implemented, and meet state and federal regulations
- Internal audits are used to validate compliance
- A single SIEM tool provides view of enterprise security events

**Level 5 (Optimized)**

- The architecture is fully composable, adaptive, and event driven
- Interfaces are personalized and continuously improved using analytics
- Session and state management is intelligent, context-aware, and resilient across devices and channels
- Architecture enables rapid innovation and seamless integration with external systems

#### Identity and Access Services

**Level 1 (Initial)**

- Multiple identity systems are in place with inconsistent standards
- Access is manually provisioned
- No centralized authentication or audit trail

**Level 2 (Developing)**

- Identity systems are partially consolidated
- Some access policies are defined
- Authentication is standardized for new systems

**Level 3 (Defined)**

- A centralized identity and access management (IAM) system is used for most applications
- Role-based access control (RBAC) is implemented

**Level 4 (Managed)**

- All applications use a single IAM system
- Multi-factor authentication (MFA) is enforced
- Access provisioning is automated and auditable

**Level 5 (Optimized)**

- Identity is federated across systems and partners
- Adaptive access controls respond to risk signals
- IAM is integrated with DevSecOps and zero trust architecture

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are identity systems fragmented and unmanaged? (Yes/No)
- Q: Is access manually provisioned? (Yes/No)
- E: Screenshots of legacy IAM tools
- E: Manual access logs

_Level 2:_

- Q: Are identity systems partially consolidated? (Yes/No)
- Q: Are access policies defined for new systems? (Yes/No)
- E: IAM policy drafts
- E: Partial integration diagrams

_Level 3:_

- Q: Is a centralized IAM system used for most applications? (Yes/No)
- Q: Is RBAC implemented? (Yes/No)
- E: IAM architecture diagrams
- E: RBAC configuration files

_Level 4:_

- Q: Is MFA enforced across all applications? (Yes/No)
- Q: Is access provisioning automated and auditable? (Yes/No)
- E: MFA logs
- E: Automated access request workflows

_Level 5:_

- Q: Is identity federated across systems and partners? (Yes/No)
- Q: Are adaptive access controls in place? (Yes/No)
- E: Federation trust configurations
- E: Risk-based access control logs

#### Consent Management

**Level 1 (Initial)**

- Consent is captured manually or inconsistently
- No centralized tracking or enforcement

**Level 2 (Developing)**

- Consent policies are defined
- Some systems capture and store consent electronically
- Revocation is manual

**Level 3 (Defined)**

- Consent is captured and enforced across systems
- Electronic consent records are auditable
- Revocation is supported through standard workflows

**Level 4 (Managed)**

- Consent is managed through centralized services
- APIs enforce consent dynamically
- Audit logs are integrated with compliance reporting

**Level 5 (Optimized)**

- Consent is context aware and member controlled
- Real-time enforcement and revocation are supported
- Consent services are interoperable across agencies and partners

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Is consent captured manually or inconsistently? (Yes/No)
- Q: Is there centralized tracking? (Yes/No)
- E: Paper forms
- E: Inconsistent consent logs

_Level 2:_

- Q: Are consent policies defined? (Yes/No)
- Q: Are electronic consents partially implemented? (Yes/No)
- E: Draft consent policy
- E: Screenshots of consent capture UI

_Level 3:_

- Q: Is consent enforced across systems? (Yes/No)
- Q: Is revocation supported through standard workflows? (Yes/No)
- E: Consent audit logs
- E: Revocation request workflows

_Level 4:_

- Q: Is consent managed through centralized services? (Yes/No)
- Q: Are APIs used to enforce consent dynamically? (Yes/No)
- E: Consent service API specifications
- E: Audit trail dashboards

_Level 5:_

- Q: Is consent context aware and member controlled? (Yes/No)
- Q: Is real-time revocation supported? (Yes/No)
- E: Member portal screenshots
- E: Real-time consent enforcement logs

#### System and Data Protection

**Level 1 (Initial)**

- Security controls are inconsistent and manually applied
- No encryption or secure configuration standards

**Level 2 (Developing)**

- Security standards are defined and partially implemented
- Some systems use encryption and secure configurations

**Level 3 (Defined)**

- Security controls are implemented across systems
- Encryption is enforced for data at rest and in transit
- Internal audits are conducted

**Level 4 (Managed)**

- Security controls are continuously monitored and updated
- Automated compliance checks are in place
- Incident response plans are tested

**Level 5 (Optimized)**

- Security controls exceed regulatory requirements
- AI/ML supports threat detection and response
- Continuous compliance is achieved through automated validation

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are security controls inconsistent and manually applied? (Yes/No)
- Q: Is encryption missing or partial? (Yes/No)
- E: Unencrypted data logs
- E: Ad hoc firewall rules

_Level 2:_

- Q: Are security standards defined but not fully implemented? (Yes/No)
- Q: Are some systems encrypted? (Yes/No)
- E: Draft security standards
- E: Partial encryption reports

_Level 3:_

- Q: Are security controls implemented across systems? (Yes/No)
- Q: Are internal audits conducted? (Yes/No)
- E: Audit reports
- E: Encryption policy enforcement logs

_Level 4:_

- Q: Are controls continuously monitored and updated? (Yes/No)
- Q: Are incident response plans tested? (Yes/No)
- E: SIEM alerts
- E: DR/Incident Response (IR) test results

_Level 5:_

- Q: Do controls exceed regulatory requirements? (Yes/No)
- Q: Is AI/ML used for threat detection? (Yes/No)
- E: Threat intelligence dashboards
- E: Automated remediation logs

#### Security Monitoring

**Level 1 (Initial)**

- Security event monitoring is siloed and inconsistent
- No centralized visibility or alerting

**Level 2 (Developing)**

- Monitoring standards are defined
- Some systems use commercial or open-source tools
- Alerts are manually reviewed

**Level 3 (Defined)**

- A SIEM tool is used across most systems
- Alerts are correlated and logged

**Level 4 (Managed)**

- A centralized SIEM provides enterprise-wide visibility
- Automated alerting and response workflows are in place

**Level 5 (Optimized)**

- SIEM is integrated with AI/ML for predictive threat detection
- Automated remediation is triggered by risk signals
- Monitoring supports real-time compliance and audit readiness

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Is monitoring siloed and inconsistent? (Yes/No)
- Q: Is there centralized visibility? (Yes/No)
- E: System-specific logs
- E: Lack of SIEM integration

_Level 2:_

- Q: Are monitoring standards defined? (Yes/No)
- Q: Are alerts manually reviewed? (Yes/No)
- E: Monitoring policy drafts
- E: Alert review logs

_Level 3:_

- Q: Is a SIEM tool used across most systems? (Yes/No)
- Q: Are alerts correlated and logged? (Yes/No)
- E: SIEM dashboards
- E: Alert correlation rules

_Level 4:_

- Q: Is a centralized SIEM used enterprise wide? (Yes/No)
- Q: Are automated alert responses in place? (Yes/No)
- E: SIEM integration diagrams
- E: Automated response workflows

_Level 5:_

- Q: Is AI/ML used for predictive threat detection? (Yes/No)
- Q: Is remediation automated? (Yes/No)
- E: Predictive analytics dashboards
- E: Auto-remediation logs

---

### 5.5.6 Operations and Maintenance

#### Overview

**Level 1 (Initial)**

- System monitoring implemented on a system-by-system basis
- Monitoring identifies problems after they happen
- Tools for operations are in place, but manual processes are still required to operate system

**Level 2 (Developing)**

- Guidelines for system monitoring are in place
- Some commercial or open-source tools for monitoring
- Standard processes are in place for operations
- System updates and patching

**Level 3 (Defined)**

- Most systems use the same tools for monitoring and alerts
- Some automation is in place to respond to problems
- Dashboards present information on system problems
- System operations processes use automation and are developing alignment with standards such as Information Technology Infrastructure Library (ITIL)

**Level 4 (Managed)**

- Monitoring and alerting are automated and integrated across systems
- Proactive monitoring is implemented for both platforms and applications
- Automation is used to respond to problems
- Dashboards present information about the system across multiple modules
- Systems operations processes are extensively automated and aligned with system management standards such as ITIL

**Level 5 (Optimized)**

- Monitoring is controlled through configuration
- Wide use of proactive monitoring and automated problem prevention and response
- Dashboards present information about the current system health and expectations for future activities operation across the MES

#### System Monitoring

**Level 1 (Initial)**

- Monitoring is implemented independently per system
- Alerts are reactive and manually reviewed
- No enterprise-wide visibility

**Level 2 (Developing)**

- Guidelines for monitoring are defined
- Some systems use commercial or open-source tools
- Alerts are partially automated

**Level 3 (Defined)**

- A common set of tools is used across most systems
- Dashboards present system health
- Alerts are integrated and monitored centrally

**Level 4 (Managed)**

- Monitoring is automated and integrated across platforms and applications
- Proactive alerting and root cause analysis are in place
- Dashboards provide real-time visibility across modules

**Level 5 (Optimized)**

- Monitoring is configuration driven and policy based
- AI/ML supports predictive alerts and automated remediation
- Dashboards forecast system health and future risks across the enterprise

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Is monitoring siloed and reactive? (Yes/No)
- Q: Is there centralized visibility? (Yes/No)
- E: System-specific logs
- E: Manual alerting procedures

_Level 2:_

- Q: Are monitoring standards defined? (Yes/No)
- Q: Are commercial / open-source tools used on some systems? (Yes/No)
- E: Monitoring policy drafts
- E: Tool deployment screenshots

_Level 3:_

- Q: Are common tools used across most systems? (Yes/No)
- Q: Are alerts integrated and monitored centrally? (Yes/No)
- E: Unified dashboards
- E: Alert correlation rules

_Level 4:_

- Q: Is monitoring automated and proactive? (Yes/No)
- Q: Are dashboards used for real-time visibility? (Yes/No)
- E: Real-time monitoring dashboards
- E: Root cause analysis logs

_Level 5:_

- Q: Is monitoring configuration-driven and predictive? (Yes/No)
- Q: Is AI/ML used for alerting and remediation? (Yes/No)
- E: Predictive analytics dashboards
- E: Automated remediation logs

#### System Operations

**Level 1 (Initial)**

- Operations are manual and system specific
- Batch jobs and file transfers are managed independently
- Updates are delayed and cause downtime

**Level 2 (Developing)**

- Routine tasks (e.g., file transfers and job scheduling) are partially automated
- Standard procedures exist for updates, but execution is manual

**Level 3 (Defined)**

- Many operations are automated
- Patching is scheduled and tested
- Updates follow defined procedures and avoid unplanned downtime

**Level 4 (Managed)**

- Operations are extensively automated and aligned with ITSM standards (e.g., ITIL)
- Updates are implemented without downtime

**Level 5 (Optimized)**

- Operations are fully automated and policy driven
- Updates are continuous and risk managed
- AI/ML supports anomaly detection and self-healing
- Operations exceed ITSM benchmarks

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Are operations manual and system specific? (Yes/No)
- Q: Are updates delayed or disruptive? (Yes/No)
- E: Manual job logs
- E: Update failure reports

_Level 2:_

- Q: Are routine tasks partially automated? (Yes/No)
- Q: Are update procedures standardized but manual? (Yes/No)
- E: File transfer scripts
- E: Patching SOPs

_Level 3:_

- Q: Are many operations automated? (Yes/No)
- Q: Are updates scheduled and tested? (Yes/No)
- E: Automation scripts
- E: Patching schedules
- E: Downtime logs

_Level 4:_

- Q: Are operations aligned with ITSM standards? (Yes/No)
- Q: Are updates implemented without downtime? (Yes/No)
- E: ITIL-aligned process documents
- E: Zero-downtime deployment logs

_Level 5:_

- Q: Are operations fully automated and policy-driven? (Yes/No)
- Q: Is AI/ML used for anomaly detection and self-healing? (Yes/No)
- E: AI-driven ops dashboards
- E: Automated patching and rollback logs

---

### 5.5.7 Development and Release

#### Overview

**Level 1 (Initial)**

- Development and release processes are manual, inconsistent, and reactive
- Code changes are not version controlled, testing is ad hoc, and security is addressed after deployment
- No formal governance or automation

**Level 2 (Developing)**

- Basic tools and practices are introduced, such as version control and environment separation
- Some testing and security practices are piloted, but processes remain siloed and inconsistently applied
- Releases are still largely manual

**Level 3 (Defined)**

- Development and release processes are standardized and documented
- Automated testing and IaC are introduced
- Security and compliance checks are integrated into the development lifecycle
- Releases follow defined gates

**Level 4 (Managed)**

- Standard practices and approaches (e.g., CI/CD pipelines) are used to automate builds, tests, and deployments
- Code and infrastructure changes are peer reviewed and traceable
- Security gates and rollback mechanisms are embedded
- Release metrics are tracked and used for improvement

**Level 5 (Optimized)**

- Development and release are continuous, adaptive, and policy driven
- AI/ML supports test optimization, anomaly detection, and predictive compliance
- The entire pipeline is monitored in real time, enabling rapid, secure, and resilient delivery of changes

#### Code and Configuration Management

**Level 1 (Initial)**

- Code and infrastructure settings are managed manually
- No version control
- Environments are inconsistently configured

**Level 2 (Developing)**

- Basic version control (e.g., Git) is introduced
- Teams begin using scripts for repeatable configurations
- Infrastructure settings are partially documented

**Level 3 (Defined)**

- Version control is standardized across teams
- IaC is adopted for provisioning
- Code and configuration changes are peer reviewed and traceable

**Level 4 (Managed)**

- IaC is integrated into CI/CD pipelines
- Code and infrastructure changes are governed by policy and auditable
- Repositories are version controlled and monitored

**Level 5 (Optimized)**

- Code and infrastructure are fully automated and policy driven
- AI/ML supports anomaly detection and predictive configuration
- Compliance is enforced continuously

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Is code managed manually without version control? (Yes/No)
- Q: Are infrastructure settings inconsistently applied? (Yes/No)
- E: Shared drive code folders
- E: Manual configuration logs

_Level 2:_

- Q: Is version control used by some teams? (Yes/No)
- Q: Are scripts used for repeatable configurations? (Yes/No)
- E: Git repo screenshots
- E: Provisioning scripts

_Level 3:_

- Q: Is version control standardized across teams? (Yes/No)
- Q: Is IaC adopted? (Yes/No)
- E: IaC templates
- E: Peer review logs

_Level 4:_

- Q: Is IaC integrated into CI/CD pipelines? (Yes/No)
- Q: Are code / configuration changes governed and auditable? (Yes/No)
- E: CI/CD pipeline configurations
- E: Change audit logs

_Level 5:_

- Q: Are code and infrastructure fully automated and policy-driven? (Yes/No)
- Q: Is AI/ML used for anomaly detection? (Yes/No)
- E: AI-based configuration monitoring
- E: Policy enforcement dashboards

#### Testing and Release

**Level 1 (Initial)**

- Testing is manual and inconsistent
- Releases are infrequent and error prone
- No formal environments or release process

**Level 2 (Developing)**

- Basic test automation is introduced
- Dev/Test/Prod environments are established
- Releases follow informal checklists

**Level 3 (Defined)**

- Automated testing is integrated into CI/CD pipelines
- Release gates and rollback procedures are defined
- Releases are traceable and documented

**Level 4 (Managed)**

- CI/CD pipelines are standardized and monitored
- Releases are automated, peer reviewed, and include rollback and canary deployments
- Metrics (e.g., deployment frequency and failure rate) are tracked

**Level 5 (Optimized)**

- Releases are continuous and adaptive
- AI/ML optimizes test coverage and prioritization
- Pipelines are self-healing and policy driven
- Release health is monitored in real time

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Is testing manual and inconsistent? (Yes/No)
- Q: Are releases infrequent and error prone? (Yes/No)
- E: Manual test scripts
- E: Release failure reports

_Level 2:_

- Q: Is basic test automation introduced? (Yes/No)
- Q: Are Dev/Test/Prod environments established? (Yes/No)
- E: Test automation logs
- E: Environment setup documents

_Level 3:_

- Q: Are automated tests integrated into CI/CD? (Yes/No)
- Q: Are release gates and rollback procedures defined? (Yes/No)
- E: CI/CD pipeline configurations
- E: Rollback playbooks

_Level 4:_

- Q: Are releases automated and peer reviewed? (Yes/No)
- Q: Are metrics like deployment frequency tracked? (Yes/No)
- E: Deployment dashboards
- E: Release audit logs

_Level 5:_

- Q: Are releases continuous and adaptive? (Yes/No)
- Q: Is AI/ML used for test optimization and risk detection? (Yes/No)
- E: Predictive release analytics
- E: Self-healing pipeline logs

#### Security and Compliance

**Level 1 (Initial)**

- Security is addressed post-deployment
- No secure coding practices or compliance checks

**Level 2 (Developing)**

- Security policies are drafted
- Static code analysis tools are piloted
- Manual compliance reviews occur before release

**Level 3 (Defined)**

- Secure coding standards are enforced
- Security scans (Static Application Security Testing [SAST] / Dynamic Application Security Testing [DAST]) are integrated into pipelines
- Compliance checklists are standardized

**Level 4 (Managed)**

- DevSecOps practices are adopted
- Security gates block non-compliant code
- Compliance evidence is automatically collected and stored

**Level 5 (Optimized)**

- Continuous compliance is achieved
- AI/ML detects security anomalies and enforces policy
- Compliance dashboards provide real-time visibility across the enterprise

**Assessment Questions & Evidence:**

_Level 1:_

- Q: Is security addressed post-deployment? (Yes/No)
- Q: Are secure coding practices absent? (Yes/No)
- E: Post-release vulnerability reports
- E: Lack of security checklists

_Level 2:_

- Q: Are security policies drafted? (Yes/No)
- Q: Are analysis tools piloted? (Yes/No)
- E: SAST tool outputs
- E: Draft security policies

_Level 3:_

- Q: Are secure coding standards enforced? (Yes/No)
- Q: Are security scans integrated into pipelines? (Yes/No)
- E: SAST/DAST logs
- E: Compliance checklists

_Level 4:_

- Q: Are DevSecOps practices adopted? (Yes/No)
- Q: Is compliance evidence automatically collected? (Yes/No)
- E: Security gate configurations
- E: Compliance audit logs

_Level 5:_

- Q: Is continuous compliance achieved? (Yes/No)
- Q: Is AI/ML used for anomaly detection and enforcement? (Yes/No)
- E: Real-time compliance dashboards
- E: AI-driven security alerts

## 6 Using Personas To Describe Maturity Levels

MITA 4.0 adds personas to explain maturity levels and make abstract concepts more relatable, understandable, and actionable. Personas are fictional, representative profiles of an organization that embody specific characteristics and behaviors.

MITA 4.0 adopted personas for explaining maturity levels to:

- **Improve Communication** – Personas make discussions about maturity levels more engaging and accessible, especially for non-technical audiences. Rather than diving into technical details, personas tell a story about the organization's journey, making it easier for everyone to understand and participate in the conversation.

- **Support Planning and Decision-Making** – Personas help stakeholders identify where they currently stand and where they want to go. By aligning their organization with a persona at a specific maturity level, stakeholders can better plan the necessary steps to move to the next level and prioritize improvements based on the persona's challenges and goals.

Personas turn abstract concepts into relatable stories. They help stakeholders understand where they are, where they want to go, and the necessary steps to get there, all while keeping the organization's focus on real-world needs and outcomes.

_Figure 2. MITA 4.0 Maturity Scale with Personas_

---

## Appendix A Maturity Profile Template

The SMA will complete this template for each Capability Domain assessed.

The Maturity Profile template is a csv/spreadsheet format with the following structure:

| MITA 4.0 Maturity Profile: \<state name\>   |           |           |            |
| ------------------------------------------- | --------- | --------- | ---------- |
|                                             |           |           |            |
| **Capability Domain: \<Domain Name Here\>** |           |           |            |
| **ORBIT**                                   | **As Is** | **To Be** | **Notes:** |
| Outcomes                                    |           |           |            |
| Roles                                       |           |           |            |
| Business Processes                          |           |           |            |
| Business Architecture                       |           |           |            |
| Information/Data Architecture               |           |           |            |
| Technical Architecture                      |           |           |            |

The spreadsheet template format will be available for download on the MITA 4.0 Guidance site. SMAs can save the spreadsheet template as a .csv file for uploading to the MES Hub (MESH).
