raw_data = """
D P
4.0 out of 5 stars Effective
Reviewed in India on 24 March 2026
Flavour Name: CranberrySize: 30 Servings (Pack of 1)Verified Purchase
I am reviewing this product after using it for 15 days. I am noticing that my skin has become smoother than ever and there is reduction in fine lines around my eyes. It mixes easily in plain water. No side effects noticed till now. The flavour is top notch.
Customer image
Helpful
Report

Shubham bodhane
5.0 out of 5 stars This is good
Reviewed in India on 25 March 2026
Flavour Name: CranberrySize: 30 Servings (Pack of 1)Verified Purchase
This Nutrova supplement is great for your skin and overall health. This helps your skin stay hydrated, and protected from damage. this supplement could really help improve your skin and keep you feeling good. The flavour is also amazing. You can go for it.
Customer image
Helpful
Report

Kamlesh
5.0 out of 5 stars Thumbs up
Reviewed in India on 11 March 2026
Flavour Name: CranberrySize: 30 Servings (Pack of 1)Verified Purchase
nice product with healthy benefits
Helpful
Report

Pratik Deshmukh
5.0 out of 5 stars Great for Skin Glow & Hair Health
Reviewed in India on 25 March 2026
Flavour Name: WatermelonSize: 30 Servings (Pack of 1)Verified Purchase
I’ve been using NUTROVA Collagen+ Antioxidants for a few weeks now and I can already see a visible improvement in my skin texture and glow.
Helpful
Report

Amaaazon customer
1.0 out of 5 stars Waste of money, DID NOT see any results after long use
Reviewed in India on 19 November 2025
Flavour Name: CranberrySize: 60 Servings (Pack of 2)Verified Purchase
Have been using this for 4 months now. I just haven’t seen any difference in hair , nails and skin elasticity. After reading all the good reviews I was convinced to go ahead and buy it but it just didn’t give any results, even after a regular intake of 4 months. I regret I bought 2 of these boxes. The ingredients didn’t even mix properly in the water. Didn’t see any effect on the sleep quality or muscle recovery.

The only saving grace is the tasty cranberry flavour. Don’t waste your money on this, this is as it is one of the collagens on the expensive side.. so now I’m again looking for other options.
8 people found this helpful
Helpful
Report

Priya Suresh
3.0 out of 5 stars spoiled/damaged
Reviewed in India on 29 October 2025
Flavour Name: CranberrySize: 30 Servings (Pack of 1)Verified Purchase
Received spoiled/damaged socket
Customer image
Customer image
Customer image
One person found this helpful
Helpful
Report
"""

import re

def extract_review_texts(raw):
    # Split into individual review blocks by detecting reviewer name followed by rating
    blocks = re.split(r'(?=\n[A-Za-z][\w\s]+?\n\d+\.\d+\s+out of 5 stars)', raw)
    
    reviews = []
    for block in blocks[1:]:
        # Find the main review text after 'Verified Purchase'
        match = re.search(r'Verified Purchase\s*\n([^C][^H].*?)(?=\n\n[A-Z]|Customer image|Helpful|Report|$)', block, re.DOTALL)
        if match:
            text = match.group(1).strip()
            # Clean multiple newlines and trim artifacts
            text = re.sub(r'\n\s*\n', ' ', text)
            text = re.sub(r'(?i)\b(helpful|report|people found).*', '', text)
            text = text.strip()
            if len(text) > 5 and not text.startswith('Flavour'):
                reviews.append(text)
    
    return reviews

extracted = extract_review_texts(raw_data)

print("Extracted Review Texts (Console Output):")
print("=" * 60)
for i, review in enumerate(extracted, 1):
    print(f"Review {i}:")
    print(review)
    print("-" * 40)

