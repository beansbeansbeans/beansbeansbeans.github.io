HI

Overview

Oughtness is a tool for prioritizing causes through crowdsourcing. On the voting page, users are asked to compare two causes at a time in terms of their criticalness or tractability. The data page shows the causes ranked by priority according to all the votes collected on the site. Oughtness is inspired by the GifGif and Place Pulse projects.

What's the point?

I built Oughtness in hopes that the data collected through the site could contribute to research on cause prioritization - a field concerned with the question of where humanity should apply its resources in order to achieve the greatest positive impact.

Methodology

Oughtness is heavily influenced by GiveWell, a charity research organization. The twelve causes presented on the site are from their list of policy areas most worthy of greater investment, and criticalness and tractability are two criteria from their framework for evaluating causes.

I adapted the analytic hierarchy process (AHP) in order to derive overall rankings for the causes from pairwise comparison data*. The AHP is a widely used technique for making complex decisions involving multiple alternatives and criteria.

The slider on the data page carries out the final phase of the AHP: weighting criteria to determine the best alternative. Or more specifically: weighting criticalness versus tractability to determine the cause that most deserves humanity's attention.

** I'm deviating from the AHP in several ways. (1) I am determining each cause's weight on the Fundamental Scale for Pairwise Comparisons (FSPC) by linearly interpolating from its favorability among voters to the FSPC. For example, if 100% of voters preferred cause A to cause B with respect to dimension Y, then A would be assigned a 9 (the FSPC's highest value). If 50% of voters preferred cause A to cause B with respect to dimension Y, then A would be assigned a 5. (2) In processing the matrices for each dimension, rather than finding each cause's principal right eigenvector, I sum its relative weights.