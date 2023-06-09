Title: Introducing AI for Neuroimaging @ IGC
summary: Learn about recent AI efforts by IGC Team
js:
css:
exts:
    -markdown.extensions.meta
    -markdown.extensions.headerid
    -markdown.extensions.tables
    markdown.extensions.toc
    -markdown.extensions.fenced_code
    -markdown.extensions.codehilite


# Introducing AI for Neuroimaging @ IGC

We are the Imaging Genetics Center AI Team from the Stevens Institute for Neuroimaging and Informatics (INI) at USC’s Keck School of Medicine. We develop advanced “big data” methods - including a variety of AI methods - to study the human brain. We study over 20 major brain diseases, including Alzheimer’s disease and Parkinson’s disease, disorders of brain development such as autism, psychiatric illnesses such as bipolar disorder, and neurogenetic disorders. 

The recent advances in deep learning and being able to make predictions from raw MRI scans can significantly improve the pace of research in neuroscience. To this end, as a part of our research, we are developing and adapting modern deep-learning algorithms to model brain data acquired by various brain imaging techniques, such as magnetic resonance imaging (MRI) and diffusion tensor imaging (DTI). We have proposed many novel model architectures to process MRI inputs for various tasks such as computer-aided diagnosis or prognosis. Addressing challenges specific to neuroimaging, we have demonstrated the benefits of using transfer learning and pretraining for neuroimaging, especially as most neuroimaging datasets are small (usually hundreds rather than tens of thousands of scans). We have also evaluated the harmonization of datasets and the additional value of fusing multiple modalities in neuroimaging studies. This post summarizes our recent efforts in these directions. 


## Convolutional Neural Networks (CNNs) for Brain MRI
Deep Neural Networks can learn efficient representations from raw data and outperform traditional AI methods, which require extensive feature engineering. Moreover, deep neural networks can also be pretrained on datasets not directly related to the task we would like to perform  and then finetuned with the task-specific dataset. This procedure is particularly useful when task-related datasets are small and can lead to stable and better results than training with task-specific datasets. Overall, deep neural networks can learn to predict from raw MRI scans without requiring much preprocessing and are more accurate, thus reducing the time to apply these to new problems.

Brain MRIs are three-dimensional (3D) tensors. One of the most common deep learning layers for processing brain MRI inputs is the 3D convolutional layers. [3D convolutional neural networks](https://www.sciencedirect.com/science/article/pii/S1361841520302358) - also known as CNNs, or ConvNets - are an extension of 2D CNNs where the kernels are 3D. They were developed to take advantage of the spatial information present in 3D medical images. However, 3D convolutional neural networks require more parameters and can only work with 3D images. This specificity to 3D images makes it difficult to use a typical neural network trained on more common 2D images (or natural images, such as photographs) or to adapt such a network to neuroimaging tasks. In other words, the datasets we can pretrain on are limited to 3D images. 


<figure class="image">
  <img src="../blogimages/intro_arch.png" alt="Architecture of 2D-Slice-CNN model">
  <figcaption>Figure 1. Architecture of 2D-Slice-CNN model. Each slice is processed by a 2D CNN</figcaption>
</figure>


To this end, we introduced 2D-Slice CNN models that process one 2D slice at a time with traditional 2D convolutional networks and combine the resulting representations using recurrent operations. We demonstrated encouraging results with [recurrent operations](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/11583/1158303/Accurate-brain-age-prediction-using-recurrent-slice-based-networks/10.1117/12.2579630.short) and further improved the results by introducing set operations such as mean or attention in our [ISBI 2021 paper](https://arxiv.org/abs/2102.04438). Figure 1 describes our idea in a nutshell. We split MRIs into 2D frames, which are processed by a stack of 2D convolutional layers (any neural network that works for natural/2D images, for example, ResNets, is applicable). The resulting representations are combined with aggregation operations like mean, RNN, or attention. We call these 2D-slice-CNN models.

<figure class="image">
  <img src="../blogimages/intro_training_curve.png" alt="Training curve`">
  <figcaption>Figure 2. Training curves for different neural network architectures</figcaption>
</figure>

We evaluated our models on the task of predicting age from MRIs of healthy subjects. This is commonly referred to as the brain age prediction task. [The brain-age gap, or the difference between predicted brain age and chronological age, can be a marker of overall brain health.  It may reflect neuroanatomical abnormalities and therefore aid early detection of brain-based disorders](https://www.thelancet.com/journals/ebiom/article/PIIS2352-3964(21)00393-5/fulltext). Our proposed architecture achieved performance similar to 3D-CNNs while being faster to train (Figure 2), more data-efficient, and less susceptible to noise in MRI slices (see our [paper](https://arxiv.org/abs/2102.04438) for detailed results). We continue to improve the neural networks for neuroimaging datasets, for example, [using Vision Transformers (ViTs) for MRI images](https://arxiv.org/abs/2303.08216) or by [harmonizing datasets from several scanners to increase the effective dataset sizes](https://www.biorxiv.org/content/10.1101/2022.11.15.516349v1).    

## Transfer Learning
Transfer learning is a technique that involves pretraining a CNN on a very large dataset, such as [ImageNet](https://www.wikiwand.com/en/ImageNet), and then finetuning it on a smaller dataset, such as a medical imaging dataset. One of the main aims behind introducing 2D-Slice-CNNs was to be able to improve neuroimaging with vision models trained on large-scale natural image datasets. To this end, we demonstrated in a paper at [ISBI 2023](https://arxiv.org/abs/2303.01491) that these 2D-slice encoder-based models improve performance when initialized with state-of-the-art computer vision models. We also extended 2D-slice models to Alzheimer’s disease prediction tasks and demonstrated superior performance. 

While using existing vision models is interesting, there is a substantial difference between natural images and MRI slices. Pretraining typically requires very large datasets, and there are now several large-scale MRI datasets of healthy subjects (a few tens of thousands of samples), including the UK BioBank and the Big Healthy Brains (BHB) datasets. To this end, we imported techniques from computer vision to pretrain models from these datasets, focusing initially on healthy subjects.  We transferred these pretrained models to detect disease in new MRI scans, and the results showed that transfer learning could significantly improve the performance of CNNs for these medical imaging tasks. Pretraining requires careful consideration choices, such as the loss function, pretraining dataset, and the pretraining task (which need not be the same as the final task the network needs to perform), and this was the topic of our [SIPAIM 2022 Paper](spiedigitallibrary.org/conference-proceedings-of-spie/12567/125671L/Evaluation-of-transfer-learning-methods-for-detecting-Alzheimers-disease-with/10.1117/12.2670457.short). You can read more about on [another post](SIPAIM_2022_nikhil_transfer.html).


## Other Modalities
Different neuroimaging techniques provide rich and diverse information about the brain, which can be efficiently sifted using neural networks to predict and extract relevant information. Traditional machine learning requires heavy feature engineering; thus, introducing new modalities would require vastly different techniques. With the power of neural networks and gradient-based learning, swapping MRIs with other neuroimaging outputs such as DTIs or PET scans is pretty straightforward. Intuitively, different modalities can bring complementary information about the prediction task. Diffusion-weighted brain MRI (dMRI) is sensitive to subtle alterations in the brain’s microstructure and can offer independent information on white matter integrity that is not detectable with standard T1-weighted MRI. Armed with this insight, we have shown that diffusion MRIs can be more beneficial for predicting dementia than structural MRIs. Moreover, combining these two different MRI scans can significantly improve the capabilities to predict Parkinson’s Disease ([Paper @ EMBC 2023](https://www.biorxiv.org/content/10.1101/2023.05.01.538952v1), [Blog Post](dMRI_dementia.html)). Similarly, we explored if combining volumetric features and demographics data with MRIs can enhance the predictability of amyloid positivity ([Blog: Combining Tabular Feature Data with T1-weighted Brain MRI for Amyloid Detection](table+t1mri_amyloid.html)). 
