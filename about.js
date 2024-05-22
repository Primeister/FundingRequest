document.addEventListener("DOMContentLoaded", function() {
    const mainElement = document.getElementById("aboutId");

    // Array containing data for each section
    const sectionsData = [
        {
            title: "PROJECT OVERVIEW",
            content: "Our funding requests management project aims to revolutionize the way organizations manage and access funding initiatives. We provide a centralized platform that facilitates the advertising of funding opportunities and the streamlined management of applications. From educational scholarships to business grants and event sponsorships, our platform caters to a diverse range of funding needs, empowering organizations to make a meaningful impact in society."
        },
        {
            title: "Vision and Mission",
            image: "images/visionAndMission.jpg",
            content: "Our vision is to create a world where accessing funding for impactful initiatives is easy, transparent, and efficient. We are on a mission to democratize access to funding opportunities, empowering individuals and organizations to pursue their goals and drive positive change in their communities. Through our platform, we strive to foster innovation, support education, and facilitate collaboration between funders and applicants."
        },
        {
            title: "Objectives and Goals",
            image: "images/objectivesAndGoals.jpg",
            content: "Provide a centralized platform for advertising funding opportunities and managing applications\nEnsure transparency, efficiency, and accessibility in the funding process\nEmpower fund managers to make informed decisions and track the progress of funding initiatives\nEnhance user experience through continuous improvement and innovation\nFoster collaboration and networking among stakeholders in the funding ecosystem"
        },
        {
            title: "KEY FEATURES",
            image: "images/keyFeatures.png",
            content: "User-friendly interface for advertising funding opportunities and submitting applications\nComprehensive user management system with roles for applicants, fund managers, and platform administrators\nBudgeting tools to track funds and manage allocations effectively\nReporting dashboard with real-time insights into funding usage and application data\nNotifications system to keep users informed about updates and relevant information\nBonus feature: Document upload and scanning to streamline the application process"
        },
        {
            title: "TEAM CONTRIBUTORS",
            image: "images/teamContributors.png",
            content: "Our project is led by a dedicated team of developers, designers, and project managers committed to delivering a high-quality and impactful solution. Meet our team [here] and learn more about our contributors [here]."
        },
        {
            title: "TIMELINE AND PROGRESS",
            image: "images/timelineAndProgress.png",
            content: "Since its inception, our project has made significant strides in development, with major milestones achieved along the way. We are currently in [development phase/release phase]."
        },
        {
            title: "VALUES AND PRINCIPLES",
            image: "images/valuesAndPrinciples.png",
            content: "Transparency: We believe in open communication and accountability throughout the funding process\nInnovation: We embrace continuous improvement and innovation to deliver the best possible experience for our users\nInclusivity: We are committed to creating an inclusive platform that supports diversity and equal access to funding opportunities\nImpact: We are driven by a desire to create positive change and make a difference in the world through our work"
        }
    ];

    // Loop through sectionsData array to create and append sections
    sectionsData.forEach(section => {
        const sectionElement = document.createElement("section");
        sectionElement.classList.add("aboutClass-section");

        const titleElement = document.createElement("h1");
        titleElement.textContent = section.title;

        const contentElement = document.createElement("p");
        contentElement.textContent = section.content;

        sectionElement.appendChild(titleElement);
        sectionElement.appendChild(contentElement);

        // Check if section has an image property
        if (section.image) {
            const imageElement = document.createElement("img");
            imageElement.src = section.image;
            imageElement.alt = section.title;
            sectionElement.insertBefore(imageElement, contentElement);
        }

        mainElement.appendChild(sectionElement);
    });
});
