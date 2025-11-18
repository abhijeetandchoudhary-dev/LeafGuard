// disease_solutions.js
// Keys are lowercase PlantVillage class names (exact text, then lowercased).
// Example: "Tomato Early Blight" → key "tomato early blight".
// Your JS should do: const key = predictedClass.toLowerCase().trim();

const DISEASE_SOLUTIONS = {
  // ---------- APPLE ----------
  "apple scab": `
    Remove and destroy infected leaves and fruit on the tree and on the ground.
    Prune the canopy to improve air flow and reduce leaf wetness.
    Use scab-resistant apple varieties where possible and avoid overhead irrigation.
    In commercial orchards, protective fungicides are usually applied from green tip through early summer according to local recommendations.
  `,
  "apple black rot": `
    Prune out dead wood, cankers, and mummified fruit, and remove them from the orchard.
    Maintain good sanitation by raking up and destroying fallen leaves and fruit.
    Avoid injuring bark and branches, because wounds can be entry points for the fungus.
    Where needed, growers use fungicides in a seasonal spray program as recommended by local extension services.
  `,
  "apple cedar rust": `
    Remove nearby wild or ornamental junipers if possible, since they act as alternate hosts.
    Plant rust-resistant apple cultivars in high-risk areas.
    Prune trees to increase air circulation and reduce humidity around leaves.
    In orchards, fungicides are often applied from pink to early summer to protect new leaves and fruit when infection risk is high.
  `,
  "apple healthy": `
    No visible disease symptoms detected on the apple leaf.
    Maintain good orchard hygiene: remove fallen leaves and pruned branches, and keep trees well pruned for air flow.
    Provide balanced fertilization and adequate but not excessive irrigation.
    Continue monitoring regularly so that problems can be caught early if they appear.
  `,

  // ---------- BLUEBERRY ----------
  "blueberry healthy": `
    Leaf appears healthy with no major disease symptoms.
    Keep the planting weed-free and ensure good drainage to avoid root problems.
    Apply mulch to conserve moisture and reduce soil splash onto leaves.
    Prune bushes to open the canopy and remove old or damaged canes, and monitor for any emerging leaf spots or blights.
  `,

  // ---------- CHERRY ----------
  "cherry healthy": `
    Cherry leaf appears healthy.
    Prune trees in late winter to remove dead or diseased wood and improve air circulation.
    Avoid overhead irrigation that keeps foliage wet for long periods.
    Maintain balanced nutrition and keep the orchard floor clean of fallen leaves and fruit.
  `,
  "cherry powdery mildew": `
    Remove and destroy heavily infected leaves and shoots to reduce inoculum.
    Encourage air movement by proper pruning and avoiding overcrowded plantings.
    Avoid excessive nitrogen fertilization, which can lead to lush, susceptible growth.
    Where disease pressure is high, apply appropriate fungicides for powdery mildew following local recommendations.
  `,

  // ---------- CORN ----------
  "corn gray leaf spot": `
    Rotate out of corn for at least one to two years and manage crop residue, because the fungus survives on infected debris.
    Plant hybrids with resistance or tolerance to gray leaf spot when available.
    Avoid very dense plantings that keep leaves wet and shaded.
    In high-value or high-risk fields, fungicides may be applied around tasseling if disease pressure and weather conditions favor infection.
  `,
  "corn common rust": `
    Use rust-resistant or tolerant corn hybrids when possible.
    Rust spores can blow in from long distances, so crop rotation alone will not eliminate the disease.
    Generally healthy plants tolerate some rust, but if infection is severe in susceptible hybrids, growers sometimes apply foliar fungicides at early to mid-season.
    Keeping plants vigorous with proper fertilization and irrigation helps reduce yield loss.
  `,
  "corn healthy": `
    Corn leaf appears healthy with no major leaf disease symptoms.
    Use resistant hybrids against common leaf diseases, and rotate away from corn to limit residue-borne pathogens.
    Avoid planting in poorly drained fields and manage crop residue appropriately.
    Continue to scout the field, especially around tasseling, when many foliar diseases can appear.
  `,
  "corn northern leaf blight": `
    Plant hybrids with good resistance to northern corn leaf blight wherever it is common.
    Rotate away from corn and manage infected residue (tillage or residue breakdown) to reduce inoculum, although spores can also arrive by wind.
    Monitor fields around tasseling; if susceptible hybrids show early symptoms and weather is cool and humid, a foliar fungicide may be used according to local guidelines.
    Maintain good plant nutrition and avoid unnecessary plant stress to reduce yield impact. :contentReference[oaicite:1]{index=1}
  `,

  // ---------- GRAPE ----------
  "grape black rot": `
    Sanitation is critical: remove and destroy mummified berries, infected clusters, and canes, and rake up fallen leaves.
    Prune vines to improve air movement and sun exposure, which helps leaves and fruit dry quickly after rain.
    Train vines properly on trellises and avoid overhead irrigation.
    In vineyards, fungicide sprays are usually started when shoots are 4–6 inches long and repeated at intervals through early to mid-season according to local recommendations. :contentReference[oaicite:2]{index=2}
  `,
  "grape black measles": `
    Black measles (Esca) is often associated with trunk fungi; there is no simple chemical cure.
    Remove and destroy severely affected vines, and avoid large pruning wounds that can allow trunk pathogens to enter.
    Disinfect pruning tools between vines and prune during dry weather when possible.
    Use healthy planting material and maintain good vine vigor through proper irrigation and nutrition.
  `,
  "grape leaf blight": `
    Remove and destroy heavily infected leaves and shoots to reduce disease pressure.
    Maintain an open canopy with proper pruning and training so leaves dry quickly after rain or dew.
    Avoid overhead irrigation over the canopy.
    When disease pressure is high, apply appropriate fungicides as recommended for leaf spot and blight diseases in grapes.
  `,
  "grape healthy": `
    Grape leaf appears healthy.
    Keep vines pruned and trained on trellises to improve light and air penetration.
    Remove old leaves and fruit mummies from the ground after harvest.
    Monitor regularly for spots, mildew, or rot so problems can be treated early.
  `,

  // ---------- ORANGE / CITRUS ----------
  "orange huanglongbing": `
    Huanglongbing (citrus greening) has no known cure; management focuses on slowing spread.
    Use only disease-free nursery stock for new plantings and immediately remove severely affected trees.
    Control the Asian citrus psyllid (the insect vector) following local guidelines, and manage alternate host plants that harbor the psyllid.
    Maintain good tree nutrition and irrigation to help mildly affected trees stay productive, but long-term, infected trees are usually removed and replaced. :contentReference[oaicite:3]{index=3}
  `,

  // ---------- PEACH ----------
  "peach bacterial spot": `
    Plant resistant or tolerant peach cultivars if available, because bacterial spot can be difficult to control.
    Avoid highly sandy or wind-exposed sites where leaf and fruit injury is more likely.
    Remove severely infected twigs and fruit, and avoid overhead irrigation that wets foliage for long periods.
    In commercial orchards, copper or other bactericide sprays may be applied during high-risk periods according to local extension recommendations.
  `,
  "peach healthy": `
    Peach leaf appears healthy.
    Prune trees annually to remove dead wood and open the canopy, improving light and air movement.
    Avoid excess nitrogen that can cause very lush, disease-prone growth.
    Remove fallen leaves and fruit after harvest to reduce inoculum of future diseases.
  `,

  // ---------- BELL PEPPER ----------
  "bell pepper bacterial spot": `
    Use disease-free seed and transplants, and consider resistant pepper varieties where available.
    Avoid working in fields when foliage is wet, and remove badly infected plants to reduce spread.
    Do not overhead irrigate if possible; instead, water at the base of the plants.
    Copper-based bactericides may provide partial protection when applied preventively according to local guidelines. :contentReference[oaicite:4]{index=4}
  `,
  "bell pepper healthy": `
    Pepper leaf appears healthy.
    Promote good airflow with proper spacing and pruning of dense foliage.
    Water at soil level rather than sprinkling overhead to keep leaves dry.
    Regularly check for spots, wilting, or insect damage so issues can be managed early.
  `,

  // ---------- POTATO ----------
  "potato early blight": `
    Remove and destroy infected leaves and crop residues after harvest to reduce carry-over.
    Avoid planting potatoes or tomatoes in the same soil for at least 2–3 years in rotation.
    Ensure good hill formation around tubers to protect them from spores and light.
    Fungicides are often applied preventively once foliage is well developed, following local recommendations for early blight management.
  `,
  "potato healthy": `
    Potato leaf appears healthy.
    Use certified, disease-free seed tubers and rotate fields away from potatoes and tomatoes.
    Avoid over-head irrigation late in the day so leaves do not remain wet overnight.
    Scout regularly for early blight, late blight, and insect pests to catch problems early.
  `,
  "potato late blight": `
    Use certified, disease-free seed and destroy any volunteer potatoes from previous crops.
    Remove and destroy infected plants promptly; do not compost diseased foliage and tubers.
    Avoid frequent late-day overhead irrigation that keeps foliage wet for long periods.
    In commercial production, fungicides specific for late blight are often applied on a regular schedule during cool, wet conditions according to local guidance.
  `,

  // ---------- RASPBERRY ----------
  "raspberry healthy": `
    Raspberry leaf appears healthy.
    Keep canes pruned according to variety (summer-bearing or everbearing) to open the canopy.
    Maintain good weed control and avoid waterlogged soils.
    Monitor regularly for cane blights, leaf spots, and insect pests, and remove any diseased canes promptly.
  `,

  // ---------- SOYBEAN ----------
  "soybean healthy": `
    Soybean leaf appears healthy.
    Practice crop rotation with non-legume crops to reduce disease and nematode pressure.
    Choose varieties with resistance to important local diseases.
    Maintain good fertility and drainage and scout fields regularly for leaf spots and rust.
  `,

  // ---------- SQUASH ----------
  "squash powdery mildew": `
    Remove heavily infected leaves early to slow spread, but avoid defoliating plants severely.
    Provide good spacing and trellising where possible so leaves dry quickly and receive direct sunlight.
    Avoid excessive nitrogen fertilization, which can promote dense, susceptible foliage.
    Fungicides labeled for powdery mildew on cucurbits may be applied preventively or at first sign of disease following local recommendations.
  `,

  // ---------- STRAWBERRY ----------
  "strawberry healthy": `
    Strawberry leaf appears healthy.
    Plant on raised beds with good drainage and use mulch (like straw or plastic) to reduce soil splash.
    Avoid overhead irrigation in the evening; drip irrigation is preferred.
    Remove old leaves after harvest and manage weeds to reduce humidity around plants.
  `,
  "strawberry leaf scorch": `
    Remove and discard severely affected leaves to reduce inoculum.
    Ensure beds are well-drained and not overcrowded, which lowers humidity around foliage.
    Avoid frequent overhead irrigation and water early in the day so leaves dry quickly.
    When disease pressure is high, resistant varieties and fungicides labeled for leaf spot/scorch may be used according to local guidance.
  `,

  // ---------- TOMATO ----------
  "tomato bacterial spot": `
    Use certified, pathogen-free seed and transplants and avoid saving seed from infected plants.
    Remove and destroy infected plants or severely diseased leaves; do not compost them in small gardens.
    Avoid overhead irrigation and working among plants when foliage is wet.
    Copper-based bactericides can help protect new growth when applied preventively, combined with good sanitation and crop rotation. :contentReference[oaicite:5]{index=5}
  `,
  "tomato early blight": `
    Remove lower, older leaves as they develop spots, and dispose of plant debris after harvest.
    Rotate fields so tomatoes and potatoes are not grown in the same soil for several years.
    Mulch around plants to reduce soil splash and avoid overhead watering.
    Fungicides for early blight are often applied at regular intervals once conditions favor disease, following local extension recommendations.
  `,
  "tomato late blight": `
    Remove and destroy infected plants immediately; do not compost diseased material.
    Use resistant varieties where available and plant certified, disease-free transplants or seed.
    Avoid prolonged leaf wetness by using drip irrigation and good spacing.
    In areas with frequent late blight, protective fungicide programs are typically followed during cool, wet weather according to local guidelines.
  `,
  "tomato leaf mold": `
    Improve airflow in greenhouses or tunnels by pruning and adequate spacing.
    Avoid high humidity and extended leaf wetness; ventilate structures and water at the base of plants.
    Remove and destroy infected leaves and plant debris.
    Fungicides may be used in commercial settings when environmental conditions favor leaf mold.
  `,
  "tomato septoria leaf spot": `
    Remove infected lower leaves as symptoms appear and dispose of them away from the planting.
    Avoid overhead irrigation and keep foliage as dry as possible.
    Rotate away from tomatoes and related crops for at least two years, and remove crop residues after harvest.
    Fungicides labeled for Septoria can be applied at first sign of disease and repeated according to local recommendations.
  `,
  "tomato two spotted spider mite": `
    Check the underside of leaves for mites and fine webbing, especially in hot, dry weather.
    Spray the undersides of leaves with a strong stream of water to dislodge mites on small plantings.
    Keep plants well watered but not waterlogged; drought-stressed plants are more susceptible.
    Where infestations are severe, miticides or horticultural oils/soaps labeled for spider mites on tomato may be used as directed.
  `,
  "tomato target spot": `
    Remove and destroy infected leaves and plant debris to reduce inoculum.
    Maintain good spacing and pruning to improve air circulation and allow foliage to dry quickly.
    Avoid evening overhead irrigation and prolonged leaf wetness.
    In commercial fields, fungicides labeled for target spot may be used as part of an integrated program.
  `,
  "tomato mosaic virus": `
    There is no chemical cure for mosaic virus; management focuses on prevention.
    Remove and destroy infected plants to limit spread and control weeds that can harbor the virus.
    Disinfect tools and avoid handling plants after using tobacco products, because some mosaic viruses can be carried this way.
    Use resistant varieties when available and purchase virus-free seed or transplants.
  `,
  "tomato yellow leaf curl virus": `
    Tomato yellow leaf curl virus is spread mainly by whiteflies; focus on vector control.
    Remove infected plants and nearby volunteer tomatoes or related weeds that can host the virus.
    Use resistant or tolerant tomato varieties where available.
    Manage whiteflies using reflective mulches, insect-proof netting, and approved insecticides or biological controls according to local recommendations.
  `,
  "tomato healthy": `
    Tomato leaf appears healthy.
    Use crop rotation, resistant varieties, and clean transplants to keep diseases low.
    Water at the base of the plant and stake or cage plants to improve airflow and reduce leaf wetness.
    Scout regularly for early blight, bacterial spot, wilts, and pests, and act quickly if symptoms appear.
  `,
};

// If you use ES modules you can also:
// export default DISEASE_SOLUTIONS;

