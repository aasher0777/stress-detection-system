import numpy as np
from typing import Tuple
from imblearn.over_sampling import SMOTE

class SmoteOversampler:
    """
    Synthetic Minority Over-sampling Technique (SMOTE) module.
    Balances acute stress class distributions against dominant resting baseline records.
    """
    def __init__(self, k_neighbors: int = 3, random_state: int = 42):
        self.k_neighbors = k_neighbors
        self.random_state = random_state
        self.smote = SMOTE(k_neighbors=self.k_neighbors, random_state=self.random_state)

    def fit_resample(self, X: np.ndarray, y: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Resamples feature matrix X and ground-truth labels y to achieve uniform class balance.
        """
        unique, counts = np.unique(y, return_counts=True)
        min_class_count = np.min(counts)

        # If smallest class has fewer instances than k_neighbors + 1, dynamically adjust k
        if min_class_count <= self.k_neighbors:
            effective_k = max(1, min_class_count - 1)
            smote_adjusted = SMOTE(k_neighbors=effective_k, random_state=self.random_state)
            return smote_adjusted.fit_resample(X, y)

        return self.smote.fit_resample(X, y)
