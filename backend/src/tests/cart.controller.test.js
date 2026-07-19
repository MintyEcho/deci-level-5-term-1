const cartController = require("../controllers/cartController");
const prisma = require("../config/prisma");

jest.mock("../config/prisma", () => ({
  cart: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  cartItem: {
    upsert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Cart Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("getCart()", () => {
    it("should fetch or build a cart and calculate the correct total price", async () => {
      prisma.cart.findUnique
        .mockResolvedValueOnce({ id: 10, userId: 1 }) // first call inside getOrCreateCart
        .mockResolvedValueOnce({                     // second full include call
          id: 10,
          userId: 1,
          items: [
            { quantity: 2, product: { price: 100 } },
            { quantity: 1, product: { price: 50 } },
          ],
        });

      await cartController.getCart(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 10,
          total: 250, // (2 * 100) + (1 * 50)
        })
      );
    });
  });

  describe("addItem()", () => {
    it("should upsert item into cart", async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 10 });
      req.body = { productId: 5, quantity: 3 };
      prisma.cartItem.upsert.mockResolvedValue({ cartId: 10, productId: 5, quantity: 3 });

      await cartController.addItem(req, res);

      expect(prisma.cartItem.upsert).toHaveBeenCalledWith({
        where: { cartId_productId: { cartId: 10, productId: 5 } },
        update: { quantity: { increment: 3 } },
        create: { cartId: 10, productId: 5, quantity: 3 },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("updateItem()", () => {
    it("should remove the item if new quantity is 0 or less", async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 10 });
      req.params.productId = "5";
      req.body = { quantity: 0 };

      await cartController.updateItem(req, res);

      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: { cartId_productId: { cartId: 10, productId: 5 } },
      });
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should update quantity if greater than 0", async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 10 });
      req.params.productId = "5";
      req.body = { quantity: 4 };
      prisma.cartItem.update.mockResolvedValue({ id: 1, quantity: 4 });

      await cartController.updateItem(req, res);

      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { cartId_productId: { cartId: 10, productId: 5 } },
        data: { quantity: 4 },
      });
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("removeItem()", () => {
    it("should delete the target item from cart", async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 10 });
      req.params.productId = "5";

      await cartController.removeItem(req, res);

      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: { cartId_productId: { cartId: 10, productId: 5 } },
      });
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});