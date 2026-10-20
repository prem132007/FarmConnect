import { useLanguage } from "../context/LanguageContext";

function Categories() {
  const { t } = useLanguage();

  const categories = [
    {
      name: t("vegetables"),
      icon: "🍅",
    },
    {
      name: t("fruits"),
      icon: "🍎",
    },
    {
      name: t("grains"),
      icon: "🌾",
    },
    {
      name: t("dairy"),
      icon: "🥛",
    },
    {
      name: t("honey"),
      icon: "🍯",
    },
    {
      name: t("spices"),
      icon: "🌶️",
    },
  ];

  return (
    <section className="categories">
      <div className="container">

        {/* Section Title */}
        <h2 className="text-center mb-5">
          {t("shopByCategories")}
        </h2>

        {/* Categories */}
        <div className="row">
          {categories.map((category, index) => (
            <div
              className="col-md-2 col-6 mb-4"
              key={index}
            >
              <div className="category-card">

                {/* Category Icon */}
                <div className="category-icon">
                  {category.icon}
                </div>

                {/* Category Name */}
                <h5>{category.name}</h5>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;