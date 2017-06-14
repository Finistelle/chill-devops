<?php

namespace AppBundle\Controller;


use AppBundle\Entity\Scenario;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class DashboardController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $scenario = new Scenario();
        $form = $this->createFormBuilder($scenario)
            ->add('Name', TextType::class)
            ->add('clientStart', IntegerType::class)
            ->add('periodicity', IntegerType::class)
            ->add('clientAdd', IntegerType::class)
            ->getForm();

        $form->handleRequest($request);


            if ($form->isSubmitted() && $form->isValid()) {

                /*TODO - SEND SIMULATION*/

                /** @var Scenario $scenario */
                $scenario = $form->getData();
                $scenario->setCreatedAt(new \DateTime());
                $scenario->setCost([
                    'month' => 'Jan',
                    'cost' => [
                        'greenCost' => 123,
                        'classicCost' => 456
                    ]
                ]);

                $em->persist($scenario);
                $em->flush();

                return $this->render('AppBundle:dashboard:index.html.twig', array(
                    'form' => $form->createView(),
                    'scenario' => $scenario
                ));
            }

        return $this->render('AppBundle:dashboard:index.html.twig', array(
            'form' => $form->createView(),
        ));
    }
}