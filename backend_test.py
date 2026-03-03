#!/usr/bin/env python3
"""
Backend API testing for Next.js Shop the Look feature
Tests the /lookadmin/data and /lookadmin/shopify endpoints
"""

import requests
import json
import sys
from datetime import datetime

class NextJSAPITester:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.admin_pass = "Fern4Life"
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=10)
            else:
                response = requests.request(method, url, json=data, headers=default_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if 'looks' in response_data:
                        print(f"   Response contains {len(response_data['looks'])} looks")
                    elif 'products' in response_data:
                        print(f"   Response contains {len(response_data['products'])} products")
                    elif 'error' in response_data:
                        print(f"   Error: {response_data['error']}")
                    elif 'success' in response_data:
                        print(f"   Success: {response_data['success']}")
                except:
                    print(f"   Response length: {len(response.text)} chars")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error response: {error_data}")
                except:
                    print(f"   Response text: {response.text[:200]}...")

            return success, response

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            return False, None
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_get_looks_data(self):
        """Test GET /lookadmin/data - should return looks JSON"""
        return self.run_test(
            "Get Looks Data",
            "GET",
            "lookadmin/data",
            200
        )

    def test_post_looks_unauthorized(self):
        """Test POST /lookadmin/data without auth - should return 401"""
        test_data = {"looks": []}
        return self.run_test(
            "Post Looks - No Auth",
            "POST",
            "lookadmin/data",
            401,
            data=test_data
        )

    def test_post_looks_wrong_auth(self):
        """Test POST /lookadmin/data with wrong auth - should return 401"""
        test_data = {"looks": []}
        headers = {"Authorization": "Bearer WrongPassword"}
        return self.run_test(
            "Post Looks - Wrong Auth",
            "POST",
            "lookadmin/data",
            401,
            data=test_data,
            headers=headers
        )

    def test_post_looks_authorized(self):
        """Test POST /lookadmin/data with correct auth - should return 200"""
        test_data = {
            "looks": [
                {
                    "id": "test",
                    "label": "Test",
                    "title": "Test Look",
                    "heroImage": "",
                    "heroImageAlt": "",
                    "products": []
                }
            ]
        }
        headers = {"Authorization": f"Bearer {self.admin_pass}"}
        return self.run_test(
            "Post Looks - Authorized",
            "POST",
            "lookadmin/data",
            200,
            data=test_data,
            headers=headers
        )

    def test_get_shopify_unauthorized(self):
        """Test GET /lookadmin/shopify without auth - should return 401"""
        return self.run_test(
            "Get Shopify Products - No Auth",
            "GET",
            "lookadmin/shopify",
            401
        )

    def test_get_shopify_authorized(self):
        """Test GET /lookadmin/shopify with auth - expect 500 (no Shopify creds)"""
        headers = {"Authorization": f"Bearer {self.admin_pass}"}
        return self.run_test(
            "Get Shopify Products - Authorized (Expected 500)",
            "GET",
            "lookadmin/shopify",
            500,
            headers=headers
        )

    def restore_original_data(self):
        """Restore original looks.json data after testing"""
        print("\n🔄 Restoring original looks data...")
        original_data = {
            "looks": [
                {
                    "id": "moms",
                    "label": "Moms", 
                    "title": "The Everyday Mom Look",
                    "heroImage": "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1200",
                    "heroImageAlt": "A styled flat lay of the Mom look",
                    "products": [
                        {
                            "shopifyProductId": "gid://shopify/Product/placeholder-001",
                            "shopifyHandle": "everyday-mom-tee",
                            "title": "Everyday Mom Tee",
                            "price": "$32.00",
                            "productUrl": "/coming-soon",
                            "selectedImageUrl": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600",
                            "selectedImageAlt": "Everyday Mom Tee in sage green",
                            "comingSoon": True
                        },
                        {
                            "shopifyProductId": "gid://shopify/Product/placeholder-002",
                            "shopifyHandle": "rooted-tote",
                            "title": "Rooted Tote Bag",
                            "price": "$24.00",
                            "productUrl": "/coming-soon",
                            "selectedImageUrl": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600",
                            "selectedImageAlt": "Rooted Tote in natural",
                            "comingSoon": True
                        },
                        {
                            "shopifyProductId": "gid://shopify/Product/placeholder-003",
                            "shopifyHandle": "fern-hoodie",
                            "title": "Fern Hoodie",
                            "price": "$58.00",
                            "productUrl": "/coming-soon",
                            "selectedImageUrl": "https://images.unsplash.com/photo-1627137727320-4a7c6782102a?w=600",
                            "selectedImageAlt": "Fern Hoodie in cream",
                            "comingSoon": True
                        }
                    ]
                },
                {
                    "id": "dads",
                    "label": "Dads",
                    "title": "The Steady Dad Look", 
                    "heroImage": "",
                    "heroImageAlt": "",
                    "products": []
                },
                {
                    "id": "family",
                    "label": "Family",
                    "title": "The Sunday Family Look",
                    "heroImage": "",
                    "heroImageAlt": "",
                    "products": []
                }
            ]
        }
        
        headers = {"Authorization": f"Bearer {self.admin_pass}"}
        success, response = self.run_test(
            "Restore Original Data",
            "POST",
            "lookadmin/data",
            200,
            data=original_data,
            headers=headers
        )
        return success

def main():
    print("🧪 Starting Next.js Shop the Look API Tests")
    print("=" * 50)
    
    tester = NextJSAPITester()
    
    # Run all tests
    tests = [
        tester.test_get_looks_data,
        tester.test_post_looks_unauthorized, 
        tester.test_post_looks_wrong_auth,
        tester.test_post_looks_authorized,
        tester.test_get_shopify_unauthorized,
        tester.test_get_shopify_authorized,
        tester.restore_original_data
    ]
    
    for test in tests:
        test()
    
    # Print summary
    print(f"\n📊 Backend API Test Results:")
    print(f"   Tests passed: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"   Success rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())