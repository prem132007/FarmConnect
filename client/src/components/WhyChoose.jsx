import { useLanguage } from "../context/LanguageContext";

function WhyChoose() {
  const { t } = useLanguage();

  const items = [
    {
      icon: "🌱",
      title: t("forFarmers"),
      desc: t("forFarmersDescription"),
    },
    {
      icon: "🛒",
      title: t("forCustomers"),
      desc: t("forCustomersDescription"),
    },
    {
      icon: "🔒",
      title: t("secureAndSafe"),
      desc: t("secureAndSafeDescription"),
    },
    {
      icon: "🌍",
      title: t("sustainableFuture"),
      desc: t("sustainableFutureDescription"),
    },
  ];

  return (
    <section className="why-section">
      <div className="container">
        <div className="row">
          {items.map((item, index) => (
            <div
              className="col-lg-3 col-md-6 mb-4"
              key={index}
            >
              <div className="why-card">
                <div className="why-icon">
                  {item.icon}
                </div>

                <h4>{item.title}</h4>

                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;